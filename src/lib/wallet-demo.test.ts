import { describe, expect, it } from "vitest";
import { approveWalletDemo, canViewWalletDemo, DEMO_APPROVAL_MS, DEMO_UNLOCK_MS, initialWalletDemo, lockWalletDemo, performWalletDemo, walletTapToPayAvailable } from "./wallet-demo";

describe("Wallet simulation boundaries", () => {
  it("denies locked and unapproved access", () => {
    expect(canViewWalletDemo(initialWalletDemo, 100)).toBe(false);
    expect(performWalletDemo(initialWalletDemo, "unlock", 100).unlockedUntil).toBe(0);
  });
  it.each(["canceled", "failed", "lockout", "unsupported"] as const)("denies %s authentication", outcome => {
    const approved = approveWalletDemo(initialWalletDemo, "unlock", outcome, 100);
    expect(performWalletDemo(approved, "unlock", 101).unlockedUntil).toBe(0);
  });
  it("allows simulated secure device credential fallback", () => {
    const state = performWalletDemo(approveWalletDemo(initialWalletDemo, "unlock", "fallback", 100), "unlock", 101);
    expect(canViewWalletDemo(state, 102)).toBe(true);
  });
  it("binds approval to one proposed action and consumes it", () => {
    const approved = approveWalletDemo(initialWalletDemo, "unlock", "success", 100);
    expect(performWalletDemo(approved, "revoke-vault-session", 101).revoked).toBe(false);
    const unlocked = performWalletDemo(approved, "unlock", 101);
    expect(unlocked.approval).toBeNull();
    expect(performWalletDemo(unlocked, "revoke-vault-session", 102).revoked).toBe(false);
  });
  it("expires approval and auto-locks after demo timeout", () => {
    const approved = approveWalletDemo(initialWalletDemo, "unlock", "success", 100);
    expect(performWalletDemo(approved, "unlock", 100 + DEMO_APPROVAL_MS).unlockedUntil).toBe(0);
    const unlocked = performWalletDemo(approved, "unlock", 101);
    expect(canViewWalletDemo(unlocked, 101 + DEMO_UNLOCK_MS)).toBe(false);
    expect(canViewWalletDemo(lockWalletDemo(unlocked), 102)).toBe(false);
  });
  it("revokes only the simulated Vault session and denies subsequent access", () => {
    const unlocked = performWalletDemo(approveWalletDemo(initialWalletDemo, "unlock", "success", 100), "unlock", 101);
    const revoked = performWalletDemo(approveWalletDemo(unlocked, "revoke-vault-session", "success", 102), "revoke-vault-session", 103);
    expect(revoked.revoked).toBe(true);
    expect(canViewWalletDemo(revoked, 104)).toBe(false);
    expect(performWalletDemo(approveWalletDemo(revoked, "unlock", "success", 104), "unlock", 105).unlockedUntil).toBe(0);
  });
  it.each(["android", "ios", "web"] as const)("never enables tap-to-pay on %s", platform => {
    expect(walletTapToPayAvailable(platform)).toBe(false);
  });
});