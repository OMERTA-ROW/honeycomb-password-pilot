import { describe, it, expect } from "vitest";
import { sha1Hex, splitHash, matchCount, clampWaitDays, accessGrantedAt } from "./breach";

describe("k-anonymity breach check", () => {
  it("only a 5-character prefix is separated for sending", async () => {
    const { prefix, suffix } = splitHash(await sha1Hex("password"));
    expect(prefix).toBe("5BAA6");
    expect(prefix + suffix).toHaveLength(40);
  });
  it("matches the suffix locally", () => {
    expect(matchCount("AAA:1\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:3861493", "1E4C9B93F3F0682250B6CF8331B7EE68FD8")).toBe(3861493);
    expect(matchCount("AAA:1", "BBB")).toBe(0);
  });
});

describe("emergency access waiting period", () => {
  it("is clamped to 1–30 days", () => {
    expect(clampWaitDays(0)).toBe(1);
    expect(clampWaitDays(90)).toBe(30);
  });
  it("access opens only after the owner-set wait", () => {
    expect(accessGrantedAt(0, 7)).toBe(7 * 86_400_000);
  });
});
