import type { SampleAccount } from "./batch";

// SAMPLE DATA ONLY — fictional accounts, no real credentials.
export const sampleAccounts: SampleAccount[] = [
  { id: "1", site: "mail.example.com", username: "sam@example.com", supported: true, requiresMfa: true },
  { id: "2", site: "bank.example.org", username: "sam.r", supported: true, requiresMfa: true },
  { id: "3", site: "shop.example.net", username: "sam@example.com", supported: true, requiresMfa: false },
  { id: "4", site: "forum.example.io", username: "honeybadger", supported: false, requiresMfa: false },
  { id: "5", site: "cloud.example.dev", username: "sam@example.com", supported: true, requiresMfa: false, simulateFailure: true },
];

export const sampleDevices = [
  { id: "dev-7f3a", name: "Work Laptop", os: "Windows 11", lastSeen: "2026-10-24 21:48 UTC", ip: "203.0.113.24", location: "Approx. Portland, OR (±1.2 km, IP-based)", stale: false, keyFp: "ed25519:7f3a…c19e" },
  { id: "dev-22b1", name: "Pixel Phone", os: "Android 16", lastSeen: "2026-10-22 08:15 UTC", ip: "198.51.100.7", location: "GPS 45.52, -122.68 (±15 m)", stale: true, keyFp: "ed25519:22b1…04aa" },
];

export const sampleHoneyEvents = [
  { t: "2026-10-23 03:12:41 UTC", decoy: "decoy-mail-01", event: "Login attempt on controlled test service", ip: "192.0.2.55", ua: "python-requests/2.31", kind: "observation" },
  { t: "2026-10-23 03:13:02 UTC", decoy: "decoy-mail-01", event: "Second attempt, same address", ip: "192.0.2.55", ua: "python-requests/2.31", kind: "suspicion" },
];

export const recoveryActions = [
  { action: "Revoke Pixel Phone vault session", status: "confirmed" },
  { action: "Rotate sync key for remaining devices", status: "pending" },
  { action: "Push lock request to Pixel Phone", status: "offline" },
  { action: "Revoke mail.example.com app password", status: "failed" },
] as const;

// SAMPLE health metadata only — flags are fictional; no passwords are stored.
import type { HealthAccount } from "./health";
export const sampleHealth: HealthAccount[] = [
  { id: "1", site: "mail.example.com", weak: false, reuseGroup: "r1", breached: true, passkey: true },
  { id: "2", site: "bank.example.org", weak: false, breached: false, passkey: false },
  { id: "3", site: "shop.example.net", weak: true, reuseGroup: "r1", breached: false, passkey: false },
  { id: "4", site: "forum.example.io", weak: true, breached: false, passkey: false },
  { id: "5", site: "cloud.example.dev", weak: false, breached: false, passkey: true },
];
