// Simulation policy only. Not real authentication, encryption or payment control.
export type DemoOutcome = "success" | "fallback" | "canceled" | "failed" | "lockout" | "unsupported";
export type DemoAction = "unlock" | "revoke-vault-session";
export type WalletDemoState = { unlockedUntil: number; revoked: boolean; approval: { action: DemoAction; expiresAt: number } | null };
export const DEMO_UNLOCK_MS = 60_000;
export const DEMO_APPROVAL_MS = 15_000;
export const initialWalletDemo: WalletDemoState = { unlockedUntil: 0, revoked: false, approval: null };
export const canViewWalletDemo = (state: WalletDemoState, now: number) => !state.revoked && now < state.unlockedUntil;
export function approveWalletDemo(state: WalletDemoState, action: DemoAction, outcome: DemoOutcome, now: number): WalletDemoState {
  if (state.revoked || (action !== "unlock" && !canViewWalletDemo(state, now))) return { ...state, approval: null };
  if (outcome !== "success" && outcome !== "fallback") return { ...state, approval: null };
  return { ...state, approval: { action, expiresAt: now + DEMO_APPROVAL_MS } };
}
export function performWalletDemo(state: WalletDemoState, action: DemoAction, now: number): WalletDemoState {
  const approval = state.approval;
  const cleared = { ...state, approval: null };
  if (state.revoked || !approval || approval.action !== action || now >= approval.expiresAt) return cleared;
  if (action === "unlock") return { ...cleared, unlockedUntil: now + DEMO_UNLOCK_MS };
  if (!canViewWalletDemo(state, now)) return cleared;
  return { ...cleared, revoked: true, unlockedUntil: 0 };
}
export function lockWalletDemo(state: WalletDemoState): WalletDemoState {
  return { ...state, unlockedUntil: 0, approval: null };
}
export const walletTapToPayAvailable = (_platform: "android" | "ios" | "web") => false;