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

export type GenStyle = "random" | "passphrase";
export interface GenPrefs { style?: GenStyle; length: number; symbols: boolean; words?: number; }

/** Cryptographically secure [0,1) — never Math.random for secrets. */
export function secureRandom(): number {
  const a = new Uint32Array(1);
  globalThis.crypto.getRandomValues(a);
  return a[0]! / 2 ** 32;
}

export function generatePassword(p: GenPrefs, rand: () => number = secureRandom): string {
  const base = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const chars = base + (p.symbols ? "!@#$%^&*-_=+" : "");
  const len = Math.max(12, Math.min(64, p.length));
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(rand() * chars.length)];
  return out;
}

// Small demo list only. A real build must use a vetted large list (e.g. EFF long wordlist).
const WORDS = ["amber","basalt","cedar","delta","ember","fjord","garnet","harbor","indigo","juniper","kestrel","lantern","meadow","nectar","onyx","pollen","quartz","ridge","saffron","thistle","umber","velvet","willow","xenon","yarrow","zephyr","comb","hive","drone","queen","wax","bramble"];

export function generatePassphrase(p: GenPrefs, rand: () => number = secureRandom): string {
  const n = Math.max(4, Math.min(10, p.words ?? 5));
  const parts = Array.from({ length: n }, () => WORDS[Math.floor(rand() * WORDS.length)]!);
  return parts.join(p.symbols ? "-" : " ");
}

export function generateReplacement(p: GenPrefs, rand: () => number = secureRandom): string {
  return p.style === "passphrase" ? generatePassphrase(p, rand) : generatePassword(p, rand);
}

const COMMON = ["password", "qwerty", "123456", "letmein", "welcome", "iloveyou", "admin", "abc123"];
const skeleton = (v: string) => v.toLowerCase().replace(/[^a-z]/g, "");

/** Issues with a user-chosen value, given other manual values in the same batch. */
export function manualIssues(value: string, others: string[]): string[] {
  const issues: string[] = [];
  if (value.length < 12) issues.push("too short");
  const low = value.toLowerCase();
  if (COMMON.some((c) => low.includes(c)) || /(.)\1{3,}/.test(value) || /(0123|1234|2345|abcd)/i.test(value)) issues.push("weak pattern");
  if (others.includes(value)) issues.push("reused");
  else if (skeleton(value).length >= 4 && others.some((o) => skeleton(o) === skeleton(value))) issues.push("predictable variation");
  return issues;
}

export function itemIssues(item: BatchItem, all: BatchItem[]): string[] {
  if (item.mode === "generate") return [];
  const others = all.filter((i) => i !== item && i.mode === "manual").map((i) => i.manualValue ?? "");
  return manualIssues(item.manualValue ?? "", others);
}

export function itemReady(item: BatchItem, all: BatchItem[] = [item]): boolean {
  return itemIssues(item, all).length === 0;
}

export function recoveryGuidance(o: Outcome): string {
  switch (o) {
    case "completed": return "Verified (simulated) with the new credential saved first, so access is preserved. Old entry would be archived, not deleted.";
    case "waiting": return "Paused for MFA. Approve the prompt on your second factor, then resume.";
    case "unsupported": return "No supported flow. Change it on the site yourself; the vault keeps your old entry until you confirm.";
    case "failed": return "Not changed. Your previous password remains valid; fix the issue, retry, or update manually.";
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
    if (!itemReady(it, items) || a.simulateFailure) { res[it.accountId] = "failed"; continue; }
    if (a.requiresMfa && !mfaApproved.has(a.id)) { res[it.accountId] = "waiting"; continue; }
    const verified = true; // simulated verification step
    res[it.accountId] = verified ? "completed" : "failed";
  }
  return res;
}
