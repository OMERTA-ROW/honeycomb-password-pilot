import { describe, it, expect } from "vitest";
import { screenNotes } from "./incident-notes";

describe("screenNotes", () => {
  it("rejects a password", () => expect(screenNotes("my password: hunter2")).not.toBeNull());
  it("rejects recovery codes", () => expect(screenNotes("here are my recovery codes abc")).not.toBeNull());
  it("rejects long random strings", () => expect(screenNotes("found Xk29fhq83Lmz0PqT7v in a file")).not.toBeNull());
  it("accepts ordinary notes", () =>
    expect(screenNotes("Oct 23 3am got a login alert from an unknown address. Bank later confirmed a blocked attempt.")).toBeNull());
  it("rejects empty notes", () => expect(screenNotes("   ")).not.toBeNull());
});
