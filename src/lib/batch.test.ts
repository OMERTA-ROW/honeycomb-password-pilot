import { describe, it, expect } from "vitest";
import { runBatch, generatePassword, type SampleAccount } from "./batch";

const accts: SampleAccount[] = [
  { id: "a", site: "a", username: "u", supported: true, requiresMfa: false },
  { id: "b", site: "b", username: "u", supported: true, requiresMfa: true },
  { id: "c", site: "c", username: "u", supported: false, requiresMfa: false },
  { id: "d", site: "d", username: "u", supported: true, requiresMfa: false, simulateFailure: true },
];

describe("runBatch", () => {
  it("reports completed / waiting / unsupported / failed", () => {
    const r = runBatch(accts, ["a", "b", "c", "d"].map((id) => ({ accountId: id, mode: "generate" as const })), new Set());
    expect(r).toEqual({ a: "completed", b: "waiting", c: "unsupported", d: "failed" });
  });
  it("MFA account completes only after approval", () => {
    const r = runBatch(accts, [{ accountId: "b", mode: "generate" }], new Set(["b"]));
    expect(r["b"]).toBe("completed");
  });
  it("manual replacement shorter than 12 chars fails", () => {
    const r = runBatch(accts, [{ accountId: "a", mode: "manual", manualValue: "short" }], new Set());
    expect(r["a"]).toBe("failed");
  });
  it("generator enforces minimum length 12", () => {
    expect(generatePassword({ length: 4, symbols: false })).toHaveLength(12);
  });
});

import { manualIssues, generatePassphrase } from "./batch";
describe("unique, non-predictable replacements", () => {
  const v = "Kp7-meadow-Rq9x";
  it("same manual value on two accounts fails both", () => {
    const r = runBatch(accts, [{ accountId: "a", mode: "manual", manualValue: v }, { accountId: "d", mode: "manual", manualValue: v }], new Set());
    expect(r["a"]).toBe("failed");
  });
  it("flags predictable variation", () => expect(manualIssues("SummerHoney2025!", ["SummerHoney2024!"])).toContain("predictable variation"));
  it("flags common weak words", () => expect(manualIssues("MyPassword!2026x", [])).toContain("weak pattern"));
  it("accepts an independent strong value", () => expect(manualIssues(v, ["Other-ridge-77Zq"])).toEqual([]));
  it("passphrase honours word count", () => expect(generatePassphrase({ length: 0, symbols: true, words: 6 }).split("-")).toHaveLength(6));
});
