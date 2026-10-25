import { describe, expect, it } from "vitest";
import { disposition, demoNotification, initialSpamDemo, sampleMessages, setSenderRule, spamDemoHealth, unsubscribeDemo } from "./spam-demo";
const message = (id: string) => { const m = sampleMessages.find(item => item.id === id); if (!m) throw new Error("Missing sample"); return m; };
describe("Spam Shield sample policy", () => {
  it("quarantines marketing SMS and spam email separately", () => {
    expect(disposition(message("sms-sale"), initialSpamDemo).quarantine).toBe(true);
    expect(disposition(message("email-risk"), initialSpamDemo).quarantine).toBe(true);
  });
  it("protects verification codes even from blocked senders", () => {
    const state = setSenderRule(initialSpamDemo, message("sms-sale"), "block");
    expect(disposition(message("sms-code"), state).quarantine).toBe(false);
  });
  it("protects important messages even from blocked senders", () => {
    const m = message("email-alert");
    expect(disposition(m, setSenderRule(initialSpamDemo, m, "block")).quarantine).toBe(false);
  });
  it("restores a message without trusting every message from its sender", () => {
    const state = { ...initialSpamDemo, restored: ["email-risk"] };
    expect(disposition(message("email-risk"), state).quarantine).toBe(false);
    expect(state.allowed).toEqual([]);
  });
  it("allowlists and unblocks trusted senders", () => {
    const m = message("sms-sale");
    const state = setSenderRule(setSenderRule(initialSpamDemo, m, "block"), m, "allow");
    expect(state.blocked).toEqual([]);
    expect(disposition(m, state).quarantine).toBe(false);
    expect(setSenderRule(state, m, "clear").allowed).toEqual([]);
  });
  it("turns off SMS without changing email filtering", () => {
    const state = { ...initialSpamDemo, channels: { sms: false, email: true } };
    expect(disposition(message("sms-sale"), state).quarantine).toBe(false);
    expect(disposition(message("email-sale"), state).quarantine).toBe(true);
  });
  it("requires explicit confirmation for trusted unsubscribe", () => {
    expect(unsubscribeDemo(initialSpamDemo, message("email-sale"), false).unsubscribed).toEqual([]);
    expect(unsubscribeDemo(initialSpamDemo, message("email-sale"), true).unsubscribed).toEqual(["email:offers@shop.example"]);
  });
  it("never unsubscribes through suspicious messages", () => {
    expect(unsubscribeDemo(initialSpamDemo, message("email-risk"), true)).toBe(initialSpamDemo);
  });
  it("Quiet Mode reduces routine notices, not important ones", () => {
    const state = { ...initialSpamDemo, quiet: true };
    expect(demoNotification(state, message("sms-sale"))).toBe("none");
    expect(demoNotification(state, message("sms-code"))).toBe("important");
  });
  it("demo status cannot become Protection active", () => {
    expect(spamDemoHealth()).toEqual({ sms: "not connected", email: "not connected", active: false });
  });
});