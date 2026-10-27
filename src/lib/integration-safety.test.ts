import { describe, expect, it } from "vitest";
import { requireIsolatedBackend } from "./integration-safety";
describe("Fixture isolation preflight", () => {
  it("refuses missing independent identity evidence", () => { expect(() => requireIsolatedBackend({})).toThrow(); });
  it("refuses identical test and live identities", () => { expect(() => requireIsolatedBackend({ isolatedRef: "same", liveRef: "same", serverUrl: "https://same.supabase.co", browserUrl: "https://same.supabase.co" })).toThrow(); });
  it("refuses this project's shared backend even when marked test", () => { expect(() => requireIsolatedBackend({ isolatedRef: "kqtabwiffhldgcughkln", liveRef: "other", serverUrl: "https://kqtabwiffhldgcughkln.supabase.co", browserUrl: "https://kqtabwiffhldgcughkln.supabase.co" })).toThrow(); });
  it("refuses mismatched actual client binding", () => { expect(() => requireIsolatedBackend({ isolatedRef: "isolated", liveRef: "live", serverUrl: "https://isolated.supabase.co", browserUrl: "https://live.supabase.co" })).toThrow(); });
  it("permits only explicitly distinct matching bindings", () => { expect(() => requireIsolatedBackend({ isolatedRef: "isolated", liveRef: "live", serverUrl: "https://isolated.supabase.co", browserUrl: "https://isolated.supabase.co" })).not.toThrow(); });
});