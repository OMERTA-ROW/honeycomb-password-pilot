// Password Health + Fix Next ranking — pure logic over SAMPLE metadata only.
// No real passwords are held: each sample account carries pre-computed flags.

export interface HealthAccount {
  id: string;
  site: string;
  weak: boolean;
  reuseGroup?: string | undefined; // accounts sharing a group id share the same password
  breached: boolean; // sample flag; real check (HIBP range API) not built yet
  passkey: boolean; // site advertises passkey support (sample)
}

export interface HealthSummary { total: number; weak: number; reused: number; breached: number; score: number; }

export function reusedIds(list: HealthAccount[]): Set<string> {
  const counts = new Map<string, number>();
  for (const a of list) if (a.reuseGroup) counts.set(a.reuseGroup, (counts.get(a.reuseGroup) ?? 0) + 1);
  return new Set(list.filter((a) => a.reuseGroup && (counts.get(a.reuseGroup) ?? 0) > 1).map((a) => a.id));
}

/** Score 0–100: share of accounts with no issue, minus extra weight for breached ones. */
export function summarize(list: HealthAccount[]): HealthSummary {
  const reused = reusedIds(list);
  const weak = list.filter((a) => a.weak).length;
  const breached = list.filter((a) => a.breached).length;
  const total = list.length;
  if (total === 0) return { total, weak, reused: 0, breached, score: 100 };
  const healthy = list.filter((a) => !a.weak && !a.breached && !reused.has(a.id)).length;
  const score = Math.max(0, Math.round((healthy / total) * 100 - (breached / total) * 20));
  return { total, weak, reused: reused.size, breached, score };
}

/** Priority: breached 100, reused 40, weak 30. Higher first; ties by site name. */
export function priority(a: HealthAccount, reused: Set<string>): number {
  return (a.breached ? 100 : 0) + (reused.has(a.id) ? 40 : 0) + (a.weak ? 30 : 0);
}

export function fixNextQueue(list: HealthAccount[], done: Set<string> = new Set()) {
  const reused = reusedIds(list);
  return list
    .filter((a) => !done.has(a.id) && priority(a, reused) > 0)
    .map((a) => ({ ...a, priority: priority(a, reused), reused: reused.has(a.id) }))
    .sort((x, y) => y.priority - x.priority || x.site.localeCompare(y.site));
}

/** Standard well-known change-password URL (W3C), fallback to site root. */
export function changePasswordUrls(site: string): string[] {
  return [`https://${site}/.well-known/change-password`, `https://${site}/`];
}
