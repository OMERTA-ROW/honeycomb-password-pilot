# Implementation checklist

## Family Guardian (owner, 2026-10-31)
- [x] Optional off-by-default /family-guardian preview; fictional aliases/age bands, consent acknowledgments, simulated invitation/accept/revoke, review/automatic sample safeguards, risk review, child warnings, minimal notifications and fictional evidence summary.
- [x] Preserve Vault functionality/theme; no real child inputs, persistence, integrations, AI, mail, account/schema changes or publishing.
- [x] 11 new policy tests plus 25 existing spam/access/autonomy tests passed; automatic build OK. Browser consent/invite/accept/revoke, automatic versus explicit blocking, notification pause, child warning, summary download and reset passed at 1280/834/390/320 with no page errors/overflow. Real integrations/security remain unverified.
- [ ] Real family membership/access controls, verified guardianship/consent, device enrollment, encryption/key recovery, retention/deletion and threat/payment/provider integrations — blocked on platform selection, independent security/child-safety review and supported native implementation.

## Private accounts completion (owner, 2026-10-27)
- [x] Finish existing account-state mounting, login/invitation/failure navigation, active-session controls and sign-out/recovery code without changing shared backend data/schema; authenticated success unverified.
- [x] 67 local tests passed; five isolation-preflight tests; seven signed-out pages and invitation failed sign-in checked; automatic build OK.
- [x] Both drafts verified to share Live; no fixtures. Exact setup and database hardening findings documented in docs/ACCOUNT_FOUNDATION.md.
- [ ] Missing VAULT_OWNER_EMAIL + independently verified provisioned identity; no owner assigned.
- [ ] Authenticated invite/role/revocation/isolation and transactional hardening — blocked on verified separate backend; no shared-backend writes.
- [x] Real Vault secrets blocked; no Omni offline CLI login or cross-project identity claim.

## Private installation and updates (owner, 2026-10-26)
- [ ] Finish existing access integration and natural dashboard/account/invitation navigation; copy-only invitation delivery, trusted owner setup; isolated draft tests only, no mail or production fixtures.
- [ ] PRIORITY: real invitation-only membership, securely bootstrapped owner, expiring/revocable/single-use invitations, server roles and isolated non-secret test records; disable public signup.
- [ ] Verify owner/member restrictions, invitation lifecycle, isolation/session denial and actual provider quotas; keep encryption/real-secret entry gated.
- [ ] Manifest, local icons, Install / Updates screen, guarded generated worker and explicit reload.
- [ ] Verify safety rules, browser flow and automatic build; document real links/native availability.
- [ ] Installed offline/update end-to-end — blocked on approved stable non-preview HTTPS origin; do not publish.

## Spam Shield (owner, 2026-10-25)
- [x] Sample-only quarantine, sender rules, protected messages, channel controls and explicit safe unsubscribe; /spam-shield and 10 policy tests.
- [x] Optional Quiet Mode and reduced-motion-aware mechanical hive visual; opt-in short playback, static with reduced motion.
- [x] Document native/email scope, health gates and cross-device startup constraints in docs/SPAM_SHIELD.md; 49 ordinary tests passed (1 existing Cloud integration skipped), automatic build OK. Browser restore/readback, block/code protection, allowlist/unblock, unsubscribe cancel/confirm, channel toggles, Quiet Mode, timeout/reduced motion passed at 1280/834/390/320 with no page errors/overflow; desktop/tablet/320 screenshots inspected.
- [ ] Real SMS/email integration — blocked on platform/provider selection, permissions, native implementation and review; no connection authorized by demo request.

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

- [x] Autonomous task settings (/autonomy): server-enforced grants, allowlist, pause/stop/revoke, redacted audit. Executor/browser companion: BLOCKED (not connected).
