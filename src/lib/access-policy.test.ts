import { describe, expect, it } from "vitest";
import { safeReturnTo } from "./access-policy";
import { canIssue, inviteSchema, verifiedOwner } from "./invitation-policy";
describe("Private access rules", () => {
  it("rejects external login destinations", () => { expect(safeReturnTo("//evil.test")).toBe("/dashboard"); expect(safeReturnTo("/\\evil.test")).toBe("/dashboard"); });
  it("preserves private return destination", () => { expect(safeReturnTo("/account")).toBe("/account"); });
  it("ordinary members cannot invite", () => { expect(canIssue("member", false, "member")).toBe(false); });
  it("delegated invitations cannot promote to admin", () => { expect(canIssue("admin", true, "admin")).toBe(false); });
  it("no invitation can grant owner", () => { expect(inviteSchema.safeParse({ email: "fixture@example.test", role: "owner", days: 7, origin: "https://example.test" }).success).toBe(false); });
  it("configuration alone cannot verify an owner", () => { expect(verifiedOwner("owner@example.test", null)).toBe(false); });
  it("unconfirmed email cannot bootstrap ownership", () => { expect(verifiedOwner("owner@example.test", { email: "owner@example.test" })).toBe(false); });
  it("a different verified email cannot bootstrap ownership", () => { expect(verifiedOwner("owner@example.test", { email: "other@example.test", email_confirmed_at: "2026-10-27" })).toBe(false); });
  it("only the configured confirmed identity can bootstrap", () => { expect(verifiedOwner(" OWNER@example.test ", { email: "owner@example.test", email_confirmed_at: "2026-10-27" })).toBe(true); });
  it("owner can invite members and admins but not owners", () => { expect(canIssue("owner", true, "member")).toBe(true); expect(canIssue("owner", true, "admin")).toBe(true); expect(canIssue("owner", true, "owner")).toBe(false); });
  it("members need explicit owner delegation to invite", () => { expect(canIssue("member", true, "member")).toBe(true); expect(canIssue("member", true, "admin")).toBe(false); });
  it("unrecognized roles cannot use delegated permissions", () => { expect(canIssue("visitor", true, "member")).toBe(false); });
  it("return navigation drops untrusted query payloads", () => { expect(safeReturnTo("/account?next=https://evil.test")).toBe("/account"); expect(safeReturnTo("/install")).toBe("/dashboard"); });
});