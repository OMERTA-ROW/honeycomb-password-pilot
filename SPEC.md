# Honeycomb Vault — Project Specification

Separate product from Honeycomb Terminal and Omni/Evolution. Canonical owner plan: https://app.notion.com/p/403c1161030681438741f869fd1244d6 Full content was pasted by the owner on 2026-10-24 and compared requirement-by-requirement in docs/GAP_CHECKLIST.md. Planning resumed by owner request (previously paused).

## Constraints
- Private, unpublished preview. No deploy, public sharing, subscriptions, or paid services.
- Sample credentials only; every simulated flow labelled. Never imply real password changes.
- No real customer passwords, no remote host access.
- Never log passwords, recovery codes, or exports. Key management/recovery need independent review.
- No universal site control; no assumed Google Password Manager write-back.

## Brand
Dark charcoal, warm amber, subtle hexagon vault mark. Tagline: "Your access. Under your control." Simple status + obvious next action.

## Features
1. Guided password batches: per-account own value or generation prefs; preview/authorize; MFA pause; verify before completed; report completed/waiting/unsupported/failed + recovery guidance.
2. Digital Honey Pack: decoys for a controlled service; alerts with time/address/event; no destructive payload or hack-back; disclose false positives & offline-copy limits.
3. Recovery dashboard from another device; auth not solely on lost device; revoke future access; OS lock guidance; no recall of exposed secrets; show confirmed/pending/offline/failed.
4. Devices: cryptographic identity, authenticated check-ins, last-seen/public IP/permitted location with timestamps, accuracy, stale labels. Find Nearby depends on OS/UWB; 5–10 ft is a test goal. No guarantees for offline/unpowered, reset, retroactive install, Find My, unmasked IP.
5. Evidence export: observation/suspicion/corroboration, tamper-evident events, collection history; no attribution from IP alone; no legal-outcome guarantees.

## Roadmap
Desktop browser extension/companion first → mobile autofill → on-device encryption & zero-knowledge sync → device-backed keys, biometrics/hardware keys → stronger export/new-device verification, auto-lock, session revocation, key rotation → passkeys.

## Pricing (proposed only)
Individual $4.99/mo or $49/yr (1 user, 10 devices). Household $9.99/mo or $99/yr (6 vaults, 30 devices). VPN $7.99/mo or $79/yr possibly later, outside core. Malwarebytes: affiliate interest only.

## Cross-promotion
Optional discreet Terminal card in Vault menu/companion only; never inside security/password/recovery flows. No Vault ads in Terminal.

## Added from canonical plan (2026-10-24)
- Purpose: make changing compromised, weak or reused passwords simple enough to finish.
- Unique independent password per account; no shared pool; flag weak choices and predictable variations; generation prefs include passphrase length and permitted characters.
- Verify and preserve access before marking complete.
- Initial scope: small set of explicitly supported desktop websites first.
- Evidence report also lists **missing records**. No legal representation, insurance or reimbursement without separate partners.
- No automatic data destruction; no unauthorized propagation; evidence kept apart from missing device.
- Name/domain/trademark unverified. Pricing not validated (audit, support, storage, fees, acquisition uncosted). Terminal priced separately ($20/yr) in its own plan.
- Parrot Security OS = possible test environment only; Ghost/Dragon products unidentified.
- Next foundations plan: docs/PLAN_AUTH_CRYPTO.md.
