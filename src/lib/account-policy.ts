import { z } from "zod";
export const displayNameSchema = z.string().trim().max(80);
export const isRecoveryFlow = (hash: string) => new URLSearchParams(hash.replace(/^#/, "")).get("type") === "recovery";
export function accountError(code?: string) {
  if (code === "email_not_confirmed") return "Verify your email before signing in. Check your inbox and spam folder.";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit") return "Too many requests. Please wait before trying again.";
  if (code === "invalid_credentials") return "Email or password is incorrect.";
  return "The account request could not be completed. Try again; no success is assumed.";
}