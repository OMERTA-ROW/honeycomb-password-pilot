# Implementation checklist

## Current visual update
- [x] Apply owner-approved black-and-gold edge-hive styling across all eight pages; automatic build OK, 15 existing tests passed, browser checks at 1280/390/320px found no horizontal page overflow or runtime errors; simulated batch/MFA, disabled AI screening and sample export verified (no publishing or access changes).

## Done (preview, simulated)
- [x] Branding, responsive shell, status page with next action
- [x] Simulated password batch flow + unit tests (src/lib/batch.test.ts)
- [x] Honey Pack, Recovery, Devices, Evidence screens (mock data, limits disclosed)
- [x] Roadmap/pricing page (proposed only), discreet Terminal card outside security flows

- [x] Gap checklist vs canonical plan (docs/GAP_CHECKLIST.md); unique/variation checks, passphrase option, missing-records category, added limits text
- [x] Sign-in/encryption/recovery plan (docs/PLAN_AUTH_CRYPTO.md)

## Blocked on owner input
- [ ] Answers to the 9 owner inputs in docs/PLAN_AUTH_CRYPTO.md §8
- [ ] Authorization for Lovable Cloud (sign-in/database) and for AI incident notes

## Not implemented (needs native/security work + independent review)
- [ ] Desktop browser extension / companion
- [ ] Mobile autofill
- [ ] On-device encryption, zero-knowledge sync, device-backed keys
- [ ] Biometrics, hardware keys, passkeys, auto-lock, session revocation, key rotation
- [ ] Real accounts/auth, decoy service, device check-ins, Find Nearby, tamper-evident log
- [x] Incident notes → AI timeline (built, disabled until owner sets INCIDENT_AI_ENABLED=true and authorizes AI Gateway)
- [ ] Billing (blocked: owner says no paid services yet)
