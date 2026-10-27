const sharedBackend = "kqtabwiffhldgcughkln";
export function requireIsolatedBackend(config: { serverUrl?: string; browserUrl?: string; isolatedRef?: string; liveRef?: string }) {
  const { serverUrl, browserUrl, isolatedRef, liveRef } = config;
  if (!serverUrl || !browserUrl || !isolatedRef || !liveRef) throw new Error("Verified isolated and live backend identities are required before fixtures");
  if (isolatedRef === liveRef || isolatedRef === sharedBackend) throw new Error("Fixtures refused on shared/live backend");
  const serverHost = new URL(serverUrl).hostname;
  const browserHost = new URL(browserUrl).hostname;
  if (serverHost !== `${isolatedRef}.supabase.co` || browserHost !== serverHost) throw new Error("Both actual runtime bindings must match the verified isolated backend");
}