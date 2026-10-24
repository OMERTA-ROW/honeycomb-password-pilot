// Shared (browser + server) rules for incident notes. Never log note contents.
import { z } from "zod";

export const MAX_NOTES_CHARS = 8000;

const SECRET_PATTERNS: RegExp[] = [
  /\b(pass(word|wd|code|phrase)?|pwd|pin)\s*[:=]/i,
  /\brecovery\s*(code|key|phrase)s?\b/i,
  /\b(backup|2fa|mfa|otp)\s*codes?\s*[:=]/i,
  /\bseed\s*phrase\b/i,
  /\b(api[_-]?key|secret|token)\s*[:=]/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(?=[A-Za-z0-9!@#$%^&*_\-+=]{16,}\b)(?=\S*\d)(?=\S*[A-Za-z])[A-Za-z0-9!@#$%^&*_\-+=]{16,}\b/,
  /\b\d{4}[- ]\d{4}[- ]\d{4}\b/,
];

/** Returns a reason if the notes look like they contain a secret; null when safe to send. */
export function screenNotes(notes: string): string | null {
  if (!notes.trim()) return "Add some notes first.";
  if (notes.length > MAX_NOTES_CHARS) return `Notes are limited to ${MAX_NOTES_CHARS} characters.`;
  if (SECRET_PATTERNS.some((r) => r.test(notes)))
    return "This looks like it may contain a password, recovery code, key or token. Remove it — Honeycomb never needs these to organize your notes.";
  return null;
}

export const timelineSchema = z.object({
  entries: z.array(
    z.object({
      when: z.string().describe("Time as stated by the owner, or 'unspecified'"),
      kind: z.enum(["observation", "suspicion", "corroboration"]),
      summary: z.string(),
      source: z.string().describe("Who or what reported it, as stated"),
    }),
  ),
  gaps: z.array(z.string()).describe("Missing information worth checking"),
});
export type Timeline = z.infer<typeof timelineSchema>;

export const INSTRUCTIONS = `You organize a vault owner's incident notes into a neutral timeline for later review.
Rules:
- Use only facts in the notes; invent nothing. Keep neutral wording; no blame or speculation beyond what the owner stated.
- kind "observation": something directly seen or recorded. "suspicion": an inference, guess or worry. "corroboration": only when the notes cite an independent confirming source.
- Never attribute an action to a person from an IP address alone; never predict legal outcomes.
- If notes contain anything resembling a password, recovery code, key or token, omit it and do not repeat it.
- Order entries chronologically; use "unspecified" when no time is given.`;
