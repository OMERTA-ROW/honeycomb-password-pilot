# Real account foundation — status and verification

Owner requested real accounts on 2026-10-25 and confirmed basic profiles. Lovable Cloud provisioning succeeded through the supported tool flow; no publishing or external account changes. Demo vault/wallet samples remain static and separate from real profiles. Authentication is not encryption; no real vault secrets accepted.

## Implemented
- `/auth`: SDK email signup/login, confirmation-aware signup state, reset request, Google and Lovable sign-in handlers with public callback; clear generic failure handling and no delivery claims.
- `/reset-password`: recovery-event/link gate, matching-password check, standard SDK update (no current-password field on recovery), sign-out after reset. Invalid recovery link cannot change a password.
- `/account`: validated display name, real registered session list, owner-only revoke/self-sign-out/other-session revocation, server-timestamped session registration/revocation/profile events.
- Profiles trigger on signup; RLS and explicit grants on every private table. Active registered session is required for reads/updates, not just a valid identity token. Sessions have seven-day absolute application-access expiry; refresh cannot revive revoked/expired rows. UI rechecks every 30 seconds; database denial is immediate.
- Revocation is for this app's account records only, not Apple/Google Wallet cards, Terminal, whole devices or recall of downloaded data. Provider access tokens may remain valid until expiry; application RLS still denies revoked sessions.
- Privileged SQL functions take no caller-supplied owner identity and validate auth.uid plus managed session existence. Anonymous execution explicitly revoked after grant inspection; signup/profile trigger functions are not directly callable by authenticated users. Remaining authenticated SECURITY DEFINER linter warnings are intentional reviewed entrypoints, not a clean security audit.

## Configuration evidence
Tools confirmed Cloud healthy, email/password enabled with confirmation on, Google and Lovable enabled. No custom email domain; the default Cloud authentication sender applies. No custom email setup or paid services activated. Minimum password settings, HIBP, secure email change, MFA and OTP/redirect settings have not been read from hosted configuration; do not infer them from defaults. Do not alter coupled configure_auth flags without reading current values.

## Actual tests
- 38 ordinary unit/routing tests passed before integration run; 12 cover Wallet simulation boundaries, 2 account input/recovery rules. Separate real-backend test uses two disposable confirmed test users: anonymous/cross-user read/update denial, cross-user revoke cannot change target, owner profile write, timestamped activity, forbidden audit insert, revoked/expired read denial and no session reactivation, signed-out denial. Tests delete their own data/users.
- Browser with disposable confirmed account: incorrect login error, successful standard email login, profile save and read-back after reload, real activity display, self-revocation/logout, signed-out private-page denial and invalid-reset denial. Confirmed test accounts are not evidence that normal email signup auto-confirms.
- Signup/verification email delivery, Google/Lovable provider round trips, successful emailed recovery and physical-device session checks are **unverified**. No real email delivery is claimed. No privileged recovery link was minted.

## Pending / blockers
- Successful owner email signup/verification/reset and social provider end-to-end: need an owner-authorized inbox/provider session; no credentials requested or assumed.
- Account password change with current-password verification, email change, profile preferences, MFA/passkey settings and comprehensive provider login/failure audit remain queued pending verified hosted security policy and a scoped follow-up. Current activity is not full auth audit or tamper-evident evidence.
- Session list covers registered app sessions, not authoritative cryptographic device enrollment or every provider session. Native biometrics, encryption, recovery decisions and independent security review remain blocked as before.
- Future shared Terminal identity needs separate authorization and architecture. No SSO implemented or other project connected.

## Isolation architecture
Real profiles/activity use Cloud SDK + RLS. Demo records never enter these tables. Every future private table/server handler must also enforce owner and active-session checks; UI checks alone are not security. Auth tokens use standard SDK-managed storage; never copy them into app audit records or logs. Activity allows event names and server times only, no request bodies, credentials or biometric data.