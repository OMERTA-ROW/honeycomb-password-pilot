# Implementation checklist

## Current visual update
- [x] Apply owner-approved black-and-gold edge-hive styling across all eight pages; automatic build OK, 15 existing tests passed, browser checks at 1280/390/320px found no horizontal page overflow or runtime errors; simulated batch/MFA, disabled AI screening and sample export verified (no publishing or access changes).

## Queued add-ons (owner, 2026-10-25)
- [x] Wallet Protection submitted/design/Demo: /wallet-protection, fixed masked samples, docs/WALLET_PROTECTION.md; no integration selected, NFC unavailable. “ISO” assumed iOS/Apple Wallet.
- [x] Wallet biometric Demo: cancellation/failure/lockout/unsupported denial, fallback, one-action step-up, timeout/auto-lock and Vault-only simulated revocation tested; native implementation remains blocked on platform/security gates.
- [x] Real account foundation: Cloud provisioned, basic profiles approved, SDK auth/reset/social entrypoints, owner + active-session RLS, registered sessions/revocation and limited activity; real login/profile/logout and isolation verified. docs/ACCOUNT_FOUNDATION.md records partial scope.
- [x] Basic profile preferences: owner-editable `show_terminal_promo` preference stored per profile (owner-scoped), hides the optional Terminal card on Status/Roadmap; never in security/password/recovery flows. Vault data is never sold (SPEC constraint).
- [ ] Account verification/reset email delivery and successful recovery/social round trips — blocked on owner-authorized inbox/provider session; no delivery claimed. Full provider activity, preferences/email/password-change/MFA settings need verified hosted policy and follow-up.
- [ ] Real Wallet encryption/native biometrics/provisioning/NFC — blocked by recovery/security review, native eligibility, entitlements/region/provider partnerships/compliance and end-to-end tests; no real payments.
- [ ] 1. Real encryption foundation (Argon2id/PBKDF2 → AES-GCM on device, ciphertext-only sync) — blocked: recovery/data-loss decisions (docs/PLAN_AUTH_CRYPTO.md §8) and independent review before real passwords; Cloud now connected for accounts only
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
- [ ] Remaining encryption/recovery/browser/site/metadata/review owner inputs in docs/PLAN_AUTH_CRYPTO.md §8; Cloud provisioning resolved, no encryption approval inferred
- [x] Lovable Cloud provisioning completed for requested account foundation
- [ ] Authorization for AI incident notes remains pending

## Not implemented (needs native/security work + independent review)
- [ ] Desktop browser extension / companion
- [ ] Mobile autofill
- [ ] On-device encryption, zero-knowledge sync, device-backed keys
- [ ] Biometrics, hardware keys, passkeys, auto-lock, session revocation, key rotation
- [x] Real account foundation (partial; see above and ACCOUNT_FOUNDATION.md)
- [ ] Decoy service, device check-ins, Find Nearby, tamper-evident log
- [x] Incident notes → AI timeline (built, disabled until owner sets INCIDENT_AI_ENABLED=true and authorizes AI Gateway)
- [ ] Billing (blocked: owner says no paid services yet)
