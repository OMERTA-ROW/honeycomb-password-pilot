import { describe, expect, it } from "vitest";
import { createFamilyProfile, demoDisposition, demoLink, guardianAlerts, guardianNotification, sampleEvidence } from "./family-guardian-demo";

const profile = createFamilyProfile("sample-1", "Little Bee", "6–9");
const linked = { ...profile, guardianConsent: true, childInformed: true, device: "demo-linked" as const, mode: "automatic" as const };
describe("Family Guardian preview policy", () => {
  it("starts with review and no device or consent", () => { expect(profile.mode).toBe("review"); expect(profile.device).toBe("unlinked"); expect(profile.guardianConsent).toBe(false); });
  it("refuses non-sample names", () => { expect(() => createFamilyProfile("1", "Real child name", "6–9")).toThrow(); });
  it("needs guardian consent before demo linking", () => { expect(demoLink({ ...profile, device: "pending", childInformed: true }).device).toBe("pending"); });
  it("needs child transparency before demo linking", () => { expect(demoLink({ ...profile, device: "pending", guardianConsent: true }).device).toBe("pending"); });
  it("requires pending invitation and both acknowledgments", () => { expect(demoLink({ ...linked, device: "pending" }).device).toBe("demo-linked"); expect(demoLink({ ...linked, device: "revoked" }).device).toBe("revoked"); });
  it("automatically simulates blocking only high confidence supported threats", () => { expect(guardianAlerts.map(a => demoDisposition(linked, a, true))).toEqual(["demo-block", "review", "review", "review"]); });
  it("review mode never automatically blocks", () => { expect(guardianAlerts.map(a => demoDisposition({ ...linked, mode: "review" }, a, true))).toEqual(["review", "review", "review", "review"]); });
  it("disabled module is inactive", () => { for (const a of guardianAlerts) expect(demoDisposition(linked, a, false)).toBe("inactive"); });
  it("revocation and withdrawn consent stop sample safeguards", () => { for (const a of guardianAlerts) { expect(demoDisposition({ ...linked, device: "revoked" }, a, true)).toBe("inactive"); expect(demoDisposition({ ...linked, guardianConsent: false }, a, true)).toBe("inactive"); expect(demoDisposition({ ...linked, childInformed: false }, a, true)).toBe("inactive"); } });
  it("notifications have no family identity or message content", () => { expect(guardianNotification()).toBe("A safety item is ready for family review. Open Family Guardian together."); for (const a of guardianAlerts) expect(guardianNotification()).not.toContain(a.observation); });
  it("evidence is allowlisted summary without raw content or identity", () => { const a = guardianAlerts[0]; if (!a) throw new Error("Missing sample"); expect(Object.keys(sampleEvidence(a))).toEqual(["notice", "category", "observation", "interpretation", "corroboration", "missingRecords", "action", "integrity"]); expect(sampleEvidence(a).corroboration).toBe("None. Sample indicator only."); });
});