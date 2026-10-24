# Next Implementation Plan — Sign-in, Vault Encryption, Key Management, Recovery

Status: **PLAN ONLY.** Nothing here is implemented. Preview stays sample-data-only and accepts no real passwords until every gate below passes.

## 0. Principle
Sign-in proves *who is talking to the server*. It does **not** protect vault secrets. Vault contents must be encrypted on the device with keys the server never holds; a fully compromised server or account database must reveal only ciphertext.

## 1. Platform feasibility (to verify, not assumed)
| Surface | Feasible approach | Known limits |
|---|---|---|
| Desktop browser extension (first) | Chrome/Edge/Firefox Manifest V3; crypto in extension context via WebCrypto + vetted WASM lib | MV3 service workers are short-lived → re-unlock or `chrome.storage.session` for in-memory keys; page content scripts are untrusted |
| Companion dashboard (web) | Same-origin web app, decrypts locally after unlock | Web origin compromise = code-delivery risk; consider extension-hosted dashboard for vault views |
| Passkeys / hardware keys | WebAuthn for sign-in; WebAuthn PRF extension for key-wrapping where supported | PRF support varies by browser/authenticator — must test matrix |
| Biometrics | Only via OS/WebAuthn platform authenticators | No direct biometric access from web |
| iOS / Android (later) | Native apps; Keychain/Secure Enclave, Android Keystore/StrongBox; AutoFill Credential Provider / Autofill Service | Separate feasibility spike; app-store review |
| Google Password Manager write-back | Not assumed; no general public write API known | Feasibility research only |

## 2. Vetted primitives (no custom crypto)
- Library: **libsodium** (libsodium.js / sodium-native) or platform WebCrypto only. No hand-rolled constructions.
- Password-based key derivation: **Argon2id** (libsodium `crypto_pwhash`, parameters set by benchmark, e.g. ≥64 MiB, ≥3 passes, reviewed).
- Symmetric encryption: **XChaCha20-Poly1305** (libsodium secretstream/aead) or AES-256-GCM via WebCrypto with random 96-bit nonces and strict nonce discipline.
- Key wrapping: per-vault random 256-bit Vault Key wrapped by (a) password-derived key, (b) device key, (c) recovery key — envelope encryption.
- Device keys: non-extractable WebCrypto keys / platform keystore; X25519 (libsodium `crypto_box`) for device-to-device sharing of wrapped keys during enrollment.
- Signatures: **Ed25519** for device identity, signed check-ins, and hash-chained event log.
- Randomness: `crypto.getRandomValues` / `randombytes_buf` only.
- Transport: TLS 1.2+ only (platform); ciphertext-only payloads on top.
- Sign-in: Lovable Cloud auth with passkey/WebAuthn preferred + TOTP second factor; account password (if any) is **separate** from vault master secret, or the vault secret is never sent (choose in review).

## 3. Threat model (initial; to be reviewed)
Assets: vault items, Vault Key, recovery key, device private keys, event log integrity.
Adversaries & expected outcome:
- Server/database breach → ciphertext + metadata only. **Metadata (item counts, timestamps, sites if unencrypted) leaks unless also encrypted** — decide which fields are encrypted.
- Malicious/compromised server code delivery → can serve backdoored web client. Mitigation: extension-signed code, reproducible builds, subresource integrity; residual risk documented.
- Stolen unlocked device → exposed; mitigation: auto-lock, short in-memory key lifetime.
- Stolen locked device → offline guessing against Argon2id; mitigation: device-key binding, strong parameters.
- Phishing of sign-in → passkeys; vault still needs unlock.
- Malicious web pages vs. extension → strict message validation, no secrets to content scripts until user action, origin matching for autofill.
- Insider/support staff → no decryption capability; no "reset vault" without recovery key.
- Account recovery abuse → recovery requires recovery key or second enrolled device; email alone never restores vault access.
Out of scope / not promised: OS-level malware with full control, unhackability, recall of secrets already exposed.

## 4. Isolation
- Crypto & key handling in a dedicated module (extension background / Web Worker), never in page context or server code.
- Server stores only: ciphertext blobs, wrapped keys, public keys, signed events. Separate tables with RLS scoped to `auth.uid()`; household members get separate vaults (no shared keys unless explicitly shared).
- Admin/service-role code never reads vault tables except for deletion jobs.
- Honey Pack decoy service on a separate backend/domain from the vault API.
- Terminal and Omni/Evolution: separate projects, no shared databases or keys.

## 5. Secret-free logging
- Allow-list logging: event type, IDs, status codes, timings. Never log request bodies on vault/recovery/export endpoints.
- Lint/test that blocks `console.*` of known secret fields; server log scrubber for patterns (same patterns as `screenNotes`).
- No analytics on vault/recovery screens. Crash reports with bodies stripped.
- Exports encrypted to a user-chosen passphrase; never emailed or stored server-side.

## 6. Recovery strategy options (owner choice)
A. **Recovery key** (printed/saved, 256-bit, shown once) + second factor. Strong; losing both = data loss.
B. **Second enrolled device** approves new device (device-to-device key transfer). Requires prior enrollment.
C. **Trusted contact / social recovery** (Shamir split). More complex; later.
Recommended start: A + B. No server-held escrow (would break "server cannot decrypt").

## 7. Build sequence & gates
1. Spike: libsodium in MV3 extension + WebAuthn PRF browser matrix. *Gate: feasibility report.*
2. Sign-in (Lovable Cloud auth, passkey + TOTP), device enrollment with Ed25519 identity. Sample data only.
3. Local vault: Argon2id → wrap Vault Key; encrypt sample items; auto-lock. Known-answer tests, nonce-uniqueness tests, wrong-key failure tests.
4. Encrypted sync of ciphertext; server-cannot-decrypt test (dump DB, attempt decrypt without client keys).
5. Recovery key + second-device enrollment; export with stronger verification.
6. Session revocation, key rotation (re-wrap Vault Key; re-encrypt on compromise).
7. **Independent security review / penetration test** of steps 2–6 by a qualified third party. *Gate: no critical/high findings open.*
8. Only then: accept real passwords, starting with owner-only beta on named desktop sites.

## 8. Missing owner inputs
1. Recovery choice: A, A+B (recommended), or include C later?
2. Is losing all recovery factors = permanent data loss acceptable (required for zero-knowledge)?
3. First browser(s): Chrome only, or Chrome + Edge + Firefox?
4. First 3–5 supported websites for real password changes.
5. "User-created passwords" meaning: manual per-account entry, preference-based generation, or both (preview does both).
6. Sign-in methods: passkey + TOTP? Allow email/password sign-in at all? Google sign-in?
7. Which metadata must be encrypted (site names, usernames, timestamps)?
8. Budget and vendor for independent security review (paid service — needs separate authorization).
9. Authorization to enable Lovable Cloud (database/auth) for step 2 — not enabled now.
