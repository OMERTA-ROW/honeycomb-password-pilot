# Implementation checklist

## Current visual update
- [x] Apply owner-approved black-and-gold edge-hive styling across all eight pages; automatic build OK, 15 existing tests passed, browser checks at 1280/390/320px found no horizontal page overflow or runtime errors; simulated batch/MFA, disabled AI screening and sample export verified (no publishing or access changes).

## Queued add-ons (owner, 2026-10-25)
- [ ] Wallet Protection (queued after existing work): sample-only UI and staged acceptance/design documentation; real native authentication, encryption, payment provisioning/NFC and provider integrations blocked by existing approvals plus platform/provider/compliance/security gates. “ISO” assumed iOS/Apple Wallet; no activation or real payments.
- [ ] Wallet biometric authorization addendum: native Face ID/fingerprint/device credential unlock and action-bound step-up; demo cancellation/failure/lockout, fallback, timeout/reauthentication and unsupported-device checks. No face images/templates/custom recognition or external payment approval gate; preserves existing approvals.
- [ ] 1. Real encryption foundation (Argon2id/PBKDF2 → AES-GCM on device, ciphertext-only sync) — blocked: needs Lovable Cloud authorization + recovery/data-loss decisions (docs/PLAN_AUTH_CRYPTO.md §8) and independent review before real passwords
- [ ] 2. HIBP k-anonymity breach check — demo on /security-model (prefix computed locally, no network); real lookup needs owner OK for outside request
- [x] 3. Password Health dashboard (/health, sample flags; breach count is a sample label)
- [x] 4. Fix Next queue (/health: ranked, opens /.well-known/change-password, suggests unique password, simulated save, done only on user confirm)
- [ ] 5. Passkey-first suggestions (sample hint shown in Fix Next; real detection not built)
- [ ] 1b. Security model documented + demo UI on /security-model (Face ID/device key needs native app)
- [ ] 6. Honey Pack alert endpoint (screen exists, demo-labelled)
- [ ] 7. Trusted contact / emergency access — demo on /emergency-access (waiting-period rule tested); real version blocked on accounts + crypto
- [x] 8. Terminal promo card (already in menu on Status/Roadmap only)

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
