export const autonomyCapabilities = {
  summarize_account_activity: "Summarize my account activity",
  draft_checklist: "Draft a review checklist",
  review_sample_health: "Review sample password health",
  suggest_change_url: "Suggest change-password pages",
} as const;
export type AutonomyCapability = keyof typeof autonomyCapabilities;
// Credential changes are never automatable; they keep explicit approval + MFA.
export const forbiddenCapabilities = ["change_credential", "read_vault_secret", "export_secrets"] as const;
export function allowedCapabilities(input: string[]): AutonomyCapability[] {
  return [...new Set(input)].filter((c): c is AutonomyCapability => c in autonomyCapabilities);
}
// No executor or browser companion is connected in this project.
export const executorReadiness = { connected: false, label: "Blocked — no executor or browser companion connected" } as const;
