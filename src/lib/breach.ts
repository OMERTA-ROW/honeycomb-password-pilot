// k-anonymity breach-check helpers (pure). Only the 5-char SHA-1 prefix would ever leave the device.
// DEMO: the preview computes the prefix locally and makes NO network request.

export async function sha1Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function splitHash(hash: string): { prefix: string; suffix: string } {
  return { prefix: hash.slice(0, 5), suffix: hash.slice(5) };
}

/** Parse a range-API response ("SUFFIX:COUNT" lines) and return the count for our suffix, compared locally. */
export function matchCount(rangeBody: string, suffix: string): number {
  for (const line of rangeBody.split(/\r?\n/)) {
    const [s, c] = line.trim().split(":");
    if (s && s.toUpperCase() === suffix.toUpperCase()) return Number(c) || 0;
  }
  return 0;
}

// Emergency-access waiting period rule (owner-set, 1–30 days).
export function clampWaitDays(d: number): number {
  return Math.min(30, Math.max(1, Math.round(d)));
}
export function accessGrantedAt(requestedMs: number, waitDays: number): number {
  return requestedMs + clampWaitDays(waitDays) * 86_400_000;
}
