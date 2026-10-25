# Wallet Protection — staged requirements & acceptance

Owner requests: 2026-10-25, including biometric authorization addendum. “ISO” is interpreted as **iOS/Apple Wallet**; this is an assumption, not platform confirmation. Queued after existing work, without overriding pauses, encryption/recovery decisions or approval gates.

## Status
- **Submitted:** durable requirements and queue recorded.
- **Design:** permitted-record encryption and native action-specific authentication; no integration selected.
- **Demo:** fixed masked fictional records; transient sample unlock/lock, action approval, fallback/denial/lockout/unsupported outcomes, 60-second auto-lock and 15-second one-action approval, Vault-only session revocation and in-memory history.
- **Implemented:** preview UI and pure simulation rules only. No real security, persistence, NFC or biometrics.
- **Blocked:** native app implementation, reviewed encryption/recovery, platform/provider/entitlement/region eligibility, compliance review and end-to-end native tests. Cloud-backed account foundation is separately implemented (ACCOUNT_FOUNDATION.md); this does not activate wallet integrations or convert sample policy into security.

## Permitted scope and exclusions
Record protection is not payment provisioning. Only fixed masked fictional references appear in this preview. Never accept/store/log full card data, CVV, PINs, payment keys, wallet tokens, passwords, face images or biometric templates. No custom face recognition or payment cryptography. Future real permitted records must be explicitly allow-listed and encrypted on-device; sync stores ciphertext only, with no server decryption key. Independent security review remains mandatory.

Vault cannot intercept, wrap, encrypt, block or control Apple/Google wallet transactions, replace wallet security or provide NFC in a web preview. Actual tap-to-pay is unavailable on every preview platform. Lost-device revocation affects only OUR Vault sessions; official wallet/account/issuer controls govern payment cards. No real payments, provider activation, external account changes, native installation or publication.

## Primary-source assessment (2026-10-25)
Documentation research identified the following primary references. Some page bodies could not be fetched through the documentation gateway (404); search-visible references do **not** establish production access or current app-specific eligibility. Re-verify exact supported SDK versions, entitlement grant criteria, issuer/payment-provider partnerships, regions and native-app requirements before choosing a real integration. None selected.

| Platform | Primary reference | Assessment / unresolved gate |
|---|---|---|
| Apple payment cards | [Apple Pay / PassKit entitlements](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/EntitlementKeyReference/ApplePayandPassKitEntitlements/ApplePayandPassKitEntitlements.html) | Payment-pass provisioning entitlement differs from ordinary passes. Archived reference only: verify current entitlement and grant criteria, issuer agreements, regions and app eligibility. |
| Google passes | [Generic Android passes](https://developers.google.com/wallet/generic/android) | Pass class/object/JWT issuance is not payment credential provisioning. No pass API selected. |
| Google payment cards | [Push provisioning early access](https://developers.google.com/pay/issuers/apis/push-provisioning/early-access), [issuer onboarding](https://developers.google.com/pay/issuers/overview/get-started) | Search-visible primary summary verified; full API documentation access is partner-gated. Production access, partnerships, eligible regions/cards and native requirements must be verified, not inferred from generic passes. |
| Apple lost device | [Lost-device support](https://support.apple.com/en-us/101593) | Official Lost Mode/card controls belong to Apple/account owner, not Vault. |
| Google lost device | [Google Wallet lost-device help](https://support.google.com/wallet/answer/7643925) | Search-visible primary guidance verified. Official handoff only; Vault does not invoke account/card changes. |
| Apple native authentication | [LAContext](https://developer.apple.com/documentation/localauthentication/lacontext), [access-control evaluation](https://developer.apple.com/documentation/localauthentication/lacontext/evaluateaccesscontrol(_:operation:localizedreason:reply:)) | Check canEvaluatePolicy; deviceOwnerAuthentication allows passcode fallback, biometric-only policy does not. Face ID usage description required. Use reviewed Keychain/Secure Enclave access controls for a specific key/action, not a reusable success boolean. |
| Android native authentication | [Biometric guide](https://developer.android.com/identity/sign-in/biometric-auth), [BiometricPrompt](https://developer.android.com/reference/androidx/biometric/BiometricPrompt), [BiometricManager](https://developer.android.com/reference/androidx/biometric/BiometricManager) | Check same allowed-authenticator combination (BIOMETRIC_STRONG / DEVICE_CREDENTIAL) for support; OS/library and CryptoObject combinations vary. Bind key-backed operation through Keystore/CryptoObject where supported; verify secure fallback design before implementation. |
| Web authentication | [WebAuthn Level 3](https://www.w3.org/TR/webauthn-3/) | User verification may be biometric, PIN or another mechanism; cannot promise Face ID/fingerprint. No real WebAuthn added here. |

## Native authorization design — not built
Unlock records using OS authentication and device-backed key access. Sensitive Vault actions require fresh approval bound to the displayed action, target session/record, request identifier, revision and short expiry; consume once. Cancel, failure, lockout, action changes or expiry invalidate approval. No blanket future permissions. Reauthenticate after auto-lock/background/timeout according to reviewed policy. Use OS-managed device credential fallback where supported; unsupported configuration must deny, not silently downgrade. A prompt callback alone is not cryptographic authorization. Payment approval remains wholly within supported Apple/Google/issuer flows.

## Acceptance criteria
| Rule | Preview evidence / real gate |
|---|---|
| Locked, unapproved and signed-out/unauthorized access denied | Pure demo tests for locked/unapproved access; real signed-out/server authorization & cross-user tests required with accounts. UI hiding is not a real security boundary. |
| Failed/canceled/lockout/unsupported authentication denies action | Concrete outcome tests in wallet-demo.test.ts; native callback/OS lockout tests required. |
| Secure device-credential fallback | Sample fallback test; native passcode/PIN prompt and platform/API compatibility tests required, no app credential form. |
| Approval binds to one action, cannot replay or authorize a different target | Demo tests bind action/consume; native request/target/revision tampering and replay tests required. |
| Timeout, auto-lock and reauthentication | Demo tests expire approval at 15s, record access at 60s and clear approvals on manual lock; native policy values not decided. Test background/foreground, key disposal, failed reauthentication. |
| Revocation scope | Demo test revokes only sample Vault state and denies reuse. Real tests revoke OUR session, preserve other owners and never change wallet card/payment state. Offline ciphertext cannot be recalled. |
| No sensitive payment/biometric data in storage/logs | Fixed fields id/platform/label/masked/device only, no entry/upload or persistence. Test future input rejection, ciphertext payload allow-list, database/log/crash-report inspection. |
| Unsupported behavior honest | android/ios/web all return false for tap-to-pay; unsupported demo outcome denies. Test native unsupported hardware/OS/region/entitlement/provider failures before enablement. |
| Review before real enablement | Independent security + provider architecture/compliance reviews, approved platforms/regions/partners, end-to-end tests and owner authorization required. No real integration switch exists. |

No real security acceptance criterion is marked complete based on a simulation test.