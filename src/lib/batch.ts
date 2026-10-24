// Pure simulation logic for guided password-update batches. No real password changes ever occur.
export type ReplaceMode = "manual" | "generate";
export type Outcome = "completed" | "waiting" | "unsupported" | "failed";

export interface SampleAccount {
  id: string;
  site: string;
  username: string;
  supported: boolean; // site has a supported change flow (simulated)
  requiresMfa: boolean;
  simulateFailure?: boolean;
}

export interface BatchItem {
  accountId: string;
  mode: ReplaceMode;
  manualValue?: string;
}

export interface GenPrefs { length: number; symbols: boolean; }

export function generatePassword(p: GenPrefs, rand: () => number = Math.random): string {
  const base = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const chars = base + (p.symbols ? "!@#$%^&*-_=+" : "");
  const len = Math.max(12, Math.min(64, p.length));
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(rand() * chars.length)];
  return out;
}

export function itemReady(item: BatchItem): boolean {
  return item.mode === "generate" || (item.manualValue ?? "").length >= 12;
}

export function recoveryGuidance(o: Outcome): string {
  switch (o) {
    case "completed": return "Verified (simulated). Old credential would be retired from the vault.";
    case "waiting": return "Paused for MFA. Approve the prompt on your second factor, then resume.";
    case "unsupported": return "No supported flow. Change it on the site yourself; the vault keeps your old entry until you confirm.";
    case "failed": return "Not changed. Your previous password remains valid; retry or update manually.";
  }
}

/** An item is only "completed" after verification passes. */
export function runBatch(
  accounts: SampleAccount[],
  items: BatchItem[],
  mfaApproved: Set<string>,
): Record<string, Outcome> {
  const res: Record<string, Outcome> = {};
  for (const it of items) {
    const a = accounts.find((x) => x.id === it.accountId);
    if (!a || !a.supported) { res[it.accountId] = "unsupported"; continue; }
    if (!itemReady(it) || a.simulateFailure) { res[it.accountId] = "failed"; continue; }
    if (a.requiresMfa && !mfaApproved.has(a.id)) { res[it.accountId] = "waiting"; continue; }
    const verified = true; // simulated verification step
    res[it.accountId] = verified ? "completed" : "failed";
  }
  return res;
}
