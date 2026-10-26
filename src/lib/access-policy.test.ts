import { describe, expect, it } from "vitest";
import { safeReturnTo } from "./access-policy";
import { canIssue, inviteSchema } from "./invitation-policy";
describe("Private access rules", () => {
  it("rejects external login destinations", () => { expect(safeReturnTo("//evil.test")).toBe("/dashboard"); expect(safeReturnTo("/\\evil.test")).toBe("/dashboard"); });
  it("preserves private return destination", () => { expect(safeReturnTo("/account")).toBe("/account"); });
  it("ordinary members cannot invite", () => { expect(canIssue("member", false, "member")).toBe(false); });
  it("delegated invitations cannot promote to admin", () => { expect(canIssue("admin", true, "admin")).toBe(false); });
  it("no invitation can grant owner", () => { expect(inviteSchema.safeParse({ email: "fixture@example.test", role: "owner", days: 7, origin: "https://example.test" }).success).toBe(false); });
});