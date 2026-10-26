import { z } from "zod";
export const inviteSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254), role: z.enum(["admin", "member"]), days: z.number().int().min(1).max(30), origin: z.string().url() });
export async function hashInvitation(token: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
}
export function canIssue(role: string, granted: boolean, requested: string) {
  return role === "owner" || (granted && requested === "member");
}