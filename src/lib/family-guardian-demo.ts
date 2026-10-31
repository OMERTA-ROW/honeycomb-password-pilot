export type AgeBand = "6–9" | "10–12" | "13–17";
export type GuardianMode = "review" | "automatic";
export type FamilyProfile = { id: string; alias: string; age: AgeBand; guardianConsent: boolean; childInformed: boolean; device: "unlinked" | "pending" | "demo-linked" | "revoked"; mode: GuardianMode; };
export type GuardianAlert = { id: string; category: "phishing" | "malicious-link" | "contact-risk" | "purchase"; title: string; observation: string; confidence: "high" | "uncertain"; sampleSupported: boolean; warning: string; };
export const familyAliases = ["Little Bee", "Scout Bee", "Sky Bee", "River Bee"] as const;
export const guardianAlerts: GuardianAlert[] = [
  { id: "link-1", category: "malicious-link", title: "Unsafe download link", observation: "Fictional link matches a sample threat indicator. The link is omitted and never opened.", confidence: "high", sampleSupported: true, warning: "Pause before opening this link. Ask a trusted grown-up to check it with you." },
  { id: "mail-1", category: "phishing", title: "Prize message asks for a sign-in", observation: "Sample promotion combines urgency with a request to sign in elsewhere. This is a risk signal, not proof.", confidence: "uncertain", sampleSupported: true, warning: "You don’t need to rush. Don’t share passwords or codes. Check with a trusted grown-up." },
  { id: "contact-1", category: "contact-risk", title: "Conversation needs a gentle check-in", observation: "Fictional pattern includes requests for secrecy and moving a conversation. Context is missing; this does not identify or accuse anyone.", confidence: "uncertain", sampleSupported: false, warning: "If a conversation makes you uncomfortable, you can stop. Talk to a trusted grown-up. You are not in trouble." },
  { id: "purchase-1", category: "purchase", title: "Unexpected purchase request", observation: "Fictional purchase asks for approval outside the usual store. Vault cannot authorize, stop or reverse payments.", confidence: "high", sampleSupported: false, warning: "Check before spending or sharing payment information. Ask a trusted grown-up to use the official store approval." },
];
export function createFamilyProfile(id: string, alias: string, age: AgeBand): FamilyProfile {
  if (!familyAliases.some(value => value === alias)) throw new Error("Choose a fictional sample alias.");
  if (!["6–9", "10–12", "13–17"].includes(age)) throw new Error("Choose a sample age band.");
  return { id, alias, age, guardianConsent: false, childInformed: false, device: "unlinked", mode: "review" };
}
export function demoLink(profile: FamilyProfile): FamilyProfile {
  if (!profile.guardianConsent || !profile.childInformed || profile.device !== "pending") return profile;
  return { ...profile, device: "demo-linked" };
}
export function demoDisposition(profile: FamilyProfile, alert: GuardianAlert, enabled: boolean): "inactive" | "review" | "demo-block" {
  if (!enabled || profile.device !== "demo-linked" || !profile.guardianConsent || !profile.childInformed) return "inactive";
  return profile.mode === "automatic" && alert.confidence === "high" && alert.sampleSupported ? "demo-block" : "review";
}
export function ageSafeguards(age: AgeBand): string {
  return age === "6–9" ? "Trusted-grown-up check-ins · simple link warnings · purchase approval guidance" : age === "10–12" ? "Explain risk signals · shared review · purchase approval guidance" : "Collaborative check-ins · clear permission boundaries · independent help options";
}
export function guardianNotification(): string { return "A safety item is ready for family review. Open Family Guardian together."; }
export function sampleEvidence(alert: GuardianAlert) {
  return { notice: "FICTIONAL DEMO — not forensic evidence; no real message, person, device or payment data", category: alert.category, observation: alert.observation, interpretation: "Risk signal only; context and independent corroboration required.", corroboration: "None. Sample indicator only.", missingRecords: "No real integration, original message or authenticated collection history.", action: "Review with a trusted adult; nothing reported or sent.", integrity: "Unsigned sample summary; no tamper-evidence or encrypted preservation." };
}