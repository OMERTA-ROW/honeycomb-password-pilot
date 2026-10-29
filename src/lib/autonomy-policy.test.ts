import { describe, expect, it } from "vitest";
import { allowedCapabilities, executorReadiness } from "./autonomy-policy";
describe("autonomy policy", () => {
  it("drops credential changes and unknown capabilities", () => {
    expect(allowedCapabilities(["draft_checklist", "change_credential", "read_vault_secret", "draft_checklist"])).toEqual(["draft_checklist"]);
  });
  it("reports the executor as not connected", () => { expect(executorReadiness.connected).toBe(false); });
});
