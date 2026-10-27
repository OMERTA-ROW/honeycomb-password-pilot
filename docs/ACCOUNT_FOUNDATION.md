# Private account completion — 2026-10-27

## Current result (supersedes older evidence below)
- Root now mounts the existing AccountProvider: real identity/membership/session state reaches every page. Fixed typed private-return navigation and all current preview errors. Existing dashboard, non-secret records, profile preferences and owner administration are preserved.
- Membership links no longer contain provider account-activation tokens. Possession of a copied link is not treated as independent mailbox proof. Sign in on Join without leaving it; failed sign-in retains the invitation in memory and clears the password. Leaving/reloading requires reopening the original link. New users require trusted account provisioning and independent confirmation; no emails sent here.
- Owner bootstrap checks the configured confirmed identity; unique owner index already exists. Configuration alone is not verification. Missing VAULT_OWNER_EMAIL and zero existing accounts/owners were confirmed. No owner assigned, no fixture created.
- Private Account/Testing controls require an active registered session. Denied sessions can still sign out. Recovery opens correctly from Account; reset first registers the recovery session and revokes other registered app sessions, then changes the password and revokes/signs out the current session. Failures do not claim complete invalidation. Recovery success remains untested.
- 67 local tests passed; shared-backend integration skipped. Added owner identity/role rules and five fixture-isolation preflight tests. The existing integration test now enrolls disposable members and refuses writes without explicitly distinct matching runtime bindings.
- Browser: seven account pages rendered without page errors; signed-out dashboard/account/testing denied private controls, owner setup blocked, invalid recovery denied. Join invalid sign-in preserved the code, removed the URL fragment and cleared the password; screenshot inspected. This is NOT authenticated end-to-end evidence.
- Hosted settings read: public signup disabled, email confirmation required, email and Google enabled. No delivery, quota or social round-trip claim. Automatic preview diagnostics reported build OK after navigation fixes.

## Exact remaining blockers / next actions
1. In this project's editor, More → Settings → Secrets: enter VAULT_OWNER_EMAIL privately. Trusted account setup must provision the matching identity and independently verify email control, then sign in and run /owner-setup. No passwords/tokens/documents in chat.
2. Both the previous draft and newly created “Verified private account test environment” share main's Live backend. Supported backend metadata and actual server/client bindings match. No isolated provisioning capability was available in these drafts; no fixtures or shared schema/data changes were made. Provide an actual separate Cloud test environment with independently verified backend identity before authenticated lifecycle/isolation fixtures.
3. Review identified database hardening still required, deliberately NOT applied to the shared backend: transactional owner bootstrap+audit; transactional invite issuance+permission check; acceptance revalidation of the inviter's role for admin grants; coordinated session registration/membership removal to avoid reactivation races. Existing acceptance already locks the invitation and atomically enforces single-use/expiry/revocation/email binding. These findings prevent claiming accounts are fully security-validated.
4. Owner/member/admin end-to-end administration, invitation acceptance/replay/revocation, cross-user isolation after membership changes, successful confirmation/recovery and social sign-in remain unverified under current invitation-only rules. Older pre-membership account checks below are historical, not proof of this release.
5. Real encrypted Vault persistence/key derivation/key management remain unbuilt and independently unaudited; real credential entry stays blocked. Omni web access is separate from its offline CLI: no CLI login implementation or verification exists in this project. No cross-project credentials or SSO.

## Historical foundation evidence (before invitation-only membership)

# Real account foundation — status and verification

Owner requested real accounts on 2026-10-25 and confirmed basic profiles. Lovable Cloud provisioning succeeded through the supported tool flow; no publishing or external account changes. Demo vault/wallet samples remain static and separate from real profiles. Authentication is not encryption; no real vault secrets accepted.

## Implemented
- `/auth`: SDK email signup/login, confirmation-aware signup state, reset request, Google and Lovable sign-in handlers with public callback; clear generic failure handling and no delivery claims.
- `/reset-password`: recovery-event/link gate, matching-password check, standard SDK update (no current-password field on recovery), sign-out after reset. Invalid recovery link cannot change a password.
- `/account`: validated display name, basic owner-editable preferences (currently only `show_terminal_promo`), real registered session list, owner-only revoke/self-sign-out/other-session revocation, server-timestamped session registration/revocation/profile events.
- Profiles trigger on signup; RLS and explicit grants on every private table. Active registered session is required for reads/updates, not just a valid identity token. Sessions have seven-day absolute application-access expiry; refresh cannot revive revoked/expired rows. UI rechecks every 30 seconds; database denial is immediate.
- Revocation is for this app's account records only, not Apple/Google Wallet cards, Terminal, whole devices or recall of downloaded data. Provider access tokens may remain valid until expiry; application RLS still denies revoked sessions.
- Privileged SQL functions take no caller-supplied owner identity and validate auth.uid plus managed session existence. Anonymous execution explicitly revoked after grant inspection; signup/profile trigger functions are not directly callable by authenticated users. Remaining authenticated SECURITY DEFINER linter warnings are intentional reviewed entrypoints, not a clean security audit.

## Configuration evidence
Tools confirmed Cloud healthy, email/password enabled, Google and Lovable enabled. A successful hosted `/auth/v1/settings` read confirmed email/Google on, signups allowed, email auto-confirm off and anonymous users off. Lovable enablement confirmed by setup tool (not exposed in that public settings map). No custom email domain; the default Cloud authentication sender applies. No custom email setup or paid services activated. Minimum password settings, HIBP, secure email change, MFA and OTP/redirect settings have not been read from hosted configuration; do not infer them from defaults. Do not alter coupled configure_auth flags without reading current values.

## Actual tests
- Final run: **40 tests passed**, including the real isolation test; automatic preview build OK. Basic security scan found no issues (not deep analysis); linter retains four intentional authenticated SECURITY DEFINER entrypoint warnings, no anonymous callable ones.
- Ordinary unit/routing tests plus separate real-backend test passed; Wallet checks include fixed masked-only fields and denial/expiry rules. Two disposable confirmed test users verify anonymous/cross-user read/update denial, cross-user revoke cannot change target, owner profile write, timestamped activity, forbidden audit insert, revoked/expired read denial and no session reactivation, signed-out denial. Tests delete their own data/users.
- Browser with disposable confirmed account: incorrect login error, successful standard email login, profile save and read-back after reload, real activity display, self-revocation/logout, signed-out private-page denial and invalid-reset denial. Confirmed test accounts are not evidence that normal email signup auto-confirms.
- All four new pages checked at 1280/834/390/320px without horizontal page overflow. Wallet screenshots inspected on desktop/tablet/phone; browser clock confirmed 60-second Demo auto-lock. Other browsers and physical devices unverified.
- Signup/verification email delivery, Google/Lovable provider round trips, successful emailed recovery and physical-device session checks are **unverified**. No real email delivery is claimed. No privileged recovery link was minted.

## Pending / blockers
- Successful owner email signup/verification/reset and social provider end-to-end: need an owner-authorized inbox/provider session; no credentials requested or assumed.
- Account password change with current-password verification, email change, profile preferences, MFA/passkey settings and comprehensive provider login/failure audit remain queued pending verified hosted security policy and a scoped follow-up. Current activity is not full auth audit or tamper-evident evidence.
- Session list covers registered app sessions, not authoritative cryptographic device enrollment or every provider session. Native biometrics, encryption, recovery decisions and independent security review remain blocked as before.
- Future shared Terminal identity needs separate authorization and architecture. No SSO implemented or other project connected.

## Isolation architecture
Real profiles/activity use Cloud SDK + RLS. Demo records never enter these tables. Every future private table/server handler must also enforce owner and active-session checks; UI checks alone are not security. Auth tokens use standard SDK-managed storage; never copy them into app audit records or logs. Activity allows event names and server times only, no request bodies, credentials or biometric data.