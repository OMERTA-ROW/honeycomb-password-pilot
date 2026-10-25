export type Channel = "sms" | "email";
export type SampleMessage = { id: string; channel: Channel; sender: string; subject: string; body: string; time: string; category: "marketing" | "suspicious" | "important" | "verification"; trustedUnsubscribe?: boolean };
export type SpamDemoState = { channels: Record<Channel, boolean>; blocked: string[]; allowed: string[]; restored: string[]; unsubscribed: string[]; quiet: boolean };
export const initialSpamDemo: SpamDemoState = { channels: { sms: true, email: true }, blocked: [], allowed: [], restored: [], unsubscribed: [], quiet: false };
export const senderKey = (m: SampleMessage) => `${m.channel}:${m.sender}`;
export const protectedMessage = (m: SampleMessage) => m.category === "verification" || m.category === "important" || /verification code|one.time code|security alert/i.test(`${m.subject} ${m.body}`);
export function disposition(m: SampleMessage, state: SpamDemoState): { quarantine: boolean; reason: string } {
  const key = senderKey(m);
  if (protectedMessage(m)) return { quarantine: false, reason: "Protected · verification or important message" };
  if (!state.channels[m.channel]) return { quarantine: false, reason: "Channel filtering off" };
  if (state.allowed.includes(key)) return { quarantine: false, reason: "Trusted sender" };
  if (state.restored.includes(m.id)) return { quarantine: false, reason: "Restored by you" };
  if (state.blocked.includes(key)) return { quarantine: true, reason: "Sender blocked by you" };
  return { quarantine: m.category === "marketing" || m.category === "suspicious", reason: m.category === "suspicious" ? "Suspicious promotion · links not opened" : "Possible marketing" };
}
export function setSenderRule(state: SpamDemoState, m: SampleMessage, rule: "block" | "allow" | "clear"): SpamDemoState {
  const key = senderKey(m);
  return { ...state, blocked: [...state.blocked.filter(k => k !== key), ...(rule === "block" ? [key] : [])], allowed: [...state.allowed.filter(k => k !== key), ...(rule === "allow" ? [key] : [])], restored: rule === "block" ? state.restored.filter(id => id !== m.id) : state.restored };
}
export function unsubscribeDemo(state: SpamDemoState, m: SampleMessage, confirmed: boolean): SpamDemoState {
  if (!confirmed || !m.trustedUnsubscribe || m.category !== "marketing") return state;
  return { ...state, unsubscribed: [...new Set([...state.unsubscribed, senderKey(m)])] };
}
export function demoNotification(state: SpamDemoState, m: SampleMessage): "important" | "summary" | "none" {
  return protectedMessage(m) ? "important" : state.quiet ? "none" : "summary";
}
// No integration exists: a toggle or animation must never confer active status.
export const spamDemoHealth = () => ({ sms: "not connected", email: "not connected", active: false } as const);

export const sampleMessages: SampleMessage[] = [
  { id: "sms-sale", channel: "sms", sender: "Sample Outlet", subject: "Weekend promotion", body: "Sample offer: 30% off selected items. Marketing message.", time: "10:42", category: "marketing", trustedUnsubscribe: true },
  { id: "sms-prize", channel: "sms", sender: "Unknown sample sender", subject: "Unclaimed reward", body: "Claim a surprise prize at a suspicious link (not shown or opened).", time: "10:35", category: "suspicious" },
  { id: "sms-code", channel: "sms", sender: "Sample Outlet", subject: "Verification code", body: "Fictional code: 000000. Not a usable credential. Never share real codes.", time: "10:30", category: "verification" },
  { id: "sms-clinic", channel: "sms", sender: "Sample Clinic", subject: "Appointment reminder", body: "Your fictional appointment is tomorrow at 09:00.", time: "09:15", category: "important" },
  { id: "email-sale", channel: "email", sender: "offers@shop.example", subject: "A seasonal offer", body: "Fictional store newsletter. Sample trusted unsubscribe metadata; no real URL.", time: "10:20", category: "marketing", trustedUnsubscribe: true },
  { id: "email-risk", channel: "email", sender: "reward@unknown.example", subject: "Urgent prize claim", body: "Suspicious sample email. Links and attachments remain unopened.", time: "09:50", category: "suspicious" },
  { id: "email-alert", channel: "email", sender: "security@account.example", subject: "Security alert", body: "Sample account access alert. Review important messages in your official account.", time: "09:40", category: "important" },
  { id: "email-receipt", channel: "email", sender: "receipts@shop.example", subject: "Order receipt", body: "Fictional receipt for your records.", time: "08:30", category: "important" },
];