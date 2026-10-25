import { describe, expect, it } from "vitest";
import { displayNameSchema, isRecoveryFlow } from "./account-policy";
describe("Account policy", () => {
  it("accepts only recovery flows for reset", () => {
    expect(isRecoveryFlow("#type=recovery&access_token=test")).toBe(true);
    expect(isRecoveryFlow("#type=signup")).toBe(false);
    expect(isRecoveryFlow("")).toBe(false);
  });
  it("limits profile values to the approved basic field", () => {
    expect(displayNameSchema.safeParse("x".repeat(81)).success).toBe(false);
    expect(displayNameSchema.parse(" Sam ")).toBe("Sam");
  });
});