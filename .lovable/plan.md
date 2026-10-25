# Staged Wallet Protection

Add a Wallet Protection page using the current black-and-gold shell and sample-only disclosures. Interpret “ISO” as iOS/Apple Wallet; no actual integration is selected.

- Show fixed masked fictional records, Android/Google Wallet and iOS/Apple Wallet assessments, and official lost-device guidance links.
- Provide a clearly marked Demo access flow: locked or unauthorized access denied, sample unlock/lock, and Vault-only simulated session revocation with sample access history. No free-form card entry, storage, payment actions or native authentication.
- Add a sample OS-authentication outcome selector covering success, cancellation, failure, lockout, device-credential fallback and unsupported devices. Require fresh action-bound approval for a Vault-only sensitive action, consume approval once, and demonstrate timeout/auto-lock. Native Face ID/fingerprint remains planned; never collect biometrics or promise a web modality.
- Label biometric/device unlock, auto-lock, encryption and sync as planned; mark provisioning and NFC tap-to-pay unavailable.
- Queue real work behind existing pauses and approvals. Update specification, gap checklist, security plan and staged wallet acceptance criteria with current primary-source findings and unresolved dependencies.

## Technical details
Keep demo policy in a pure tested module, records in sample data, and transient state in the page. No backend, persistence, crypto implementation, provider activation, payments or publishing. Run existing and new policy tests, check preview build signals, and inspect desktop/tablet/phone screenshots and the Demo flow.
Verify primary native authentication documentation and record cancellation/failure, fallback, lockout, timeout, supported-device and one-action authorization acceptance criteria.