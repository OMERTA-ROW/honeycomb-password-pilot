# Implementation checklist

## Done (preview, simulated)
- [x] Branding, responsive shell, status page with next action
- [x] Simulated password batch flow + unit tests (src/lib/batch.test.ts)
- [x] Honey Pack, Recovery, Devices, Evidence screens (mock data, limits disclosed)
- [x] Roadmap/pricing page (proposed only), discreet Terminal card outside security flows

## Not implemented (needs native/security work + independent review)
- [ ] Desktop browser extension / companion
- [ ] Mobile autofill
- [ ] On-device encryption, zero-knowledge sync, device-backed keys
- [ ] Biometrics, hardware keys, passkeys, auto-lock, session revocation, key rotation
- [ ] Real accounts/auth, decoy service, device check-ins, Find Nearby, tamper-evident log
- [x] Incident notes → AI timeline (built, disabled until owner sets INCIDENT_AI_ENABLED=true and authorizes AI Gateway)
- [ ] Billing (blocked: owner says no paid services yet)
