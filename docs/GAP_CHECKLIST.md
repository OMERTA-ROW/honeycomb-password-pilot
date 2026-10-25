# Honeycomb Vault — Requirement Gap Checklist

Source: canonical Notion "Honeycomb Vault — Product Plan" as pasted by the owner on 2026-10-24 (agent did not access the private link). Later decisions take precedence over earlier scope.

Status key: **IMPL** = works in preview (evidence: tests/browser) · **SIM** = simulated with sample data, labelled · **DOC** = disclosed as a limit/guidance text only · **UNBUILT** = not started · **BLOCKED** = needs an owner input or review first.

Evidence references: `src/lib/batch.test.ts` (9 tests), `src/lib/incident-notes.test.ts` (5 tests), Playwright click-through of `/accounts` batch flow and `/incident-notes` secret warning (2026-10-24).

## Purpose & owner direction
| Requirement | Status | Evidence / note |
|---|---|---|
| App + browser support across desktop/mobile | UNBUILT | Web preview only. Extension/mobile not started. |
| Support password sites/apps; universal compatibility is a goal, not verified | DOC | Roadmap page states no universal site control. |
| Encrypted credential handling | UNBUILT / BLOCKED | See docs/PLAN_AUTH_CRYPTO.md; needs review gate. |
| User chooses own replacement or generation preferences | SIM | Per-account "Enter my own" or Generate (random length/symbols or passphrase word count). |
| Different strong password per account; no shared pool | IMPL (logic) / SIM (flow) | `runBatch` fails reused manual values and flags predictable variations; generation is per account using `crypto.getRandomValues`. Tests: "same manual value…", "flags predictable variation". |
| Simple guided workflow for many accounts | SIM | `/accounts` select → preview → authorize → MFA pause → report. |

## Proposed experience (steps 1–6)
| Step | Status | Note |
|---|---|---|
| 1 Unlock app, connect supported account sources | UNBUILT | Status shows "Locked" (mock). No unlock, no sources. Listed under Mocked/Not implemented on Roadmap. |
| 2 Choose unique replacement or approve generation prefs | SIM | Weak/reused/variation issues shown in preview. |
| 3 Preview and authorize | SIM | |
| 4 Apply changes; pause for verification/MFA | SIM | No site is contacted. |
| 5 Verify and preserve access before complete | SIM | Only "completed" after simulated verification; guidance states new credential saved first, old archived. |
| 6 Completed/waiting/unsupported/failed + guidance | IMPL (logic) | Test "reports completed / waiting / unsupported / failed". |

## Architecture & security
| Requirement | Status | Note |
|---|---|---|
| Desktop extension + companion dashboard first | UNBUILT | Plan step in PLAN_AUTH_CRYPTO.md. |
| Mobile apps / autofill after feasibility | UNBUILT | |
| Encrypt at rest & in transit; on-device; user-controlled keys | UNBUILT / BLOCKED | Review gate. |
| Never put passwords/recovery codes/exports in Notion, chat, analytics, logs | IMPL (partial) | Incident notes blocked if they look like secrets (browser + server); notes not logged. No analytics added. Sample values in batch flow stay in browser memory only. |
| Unpredictable independent secrets; flag weak/predictable | IMPL (logic) | `secureRandom`, `manualIssues`. Demo passphrase list is small (32 words) — must be replaced by a vetted large list before real use. |
| No assumed universal control / Google Password Manager write-back | DOC | |
| Initial scope: few explicitly supported desktop sites | DOC / BLOCKED | Owner must name sites. |

## Brand & focus
| Requirement | Status | Note |
|---|---|---|
| Name Honeycomb Vault; clearance unverified | DOC | Roadmap notes not cleared. |
| Digital Honey Pack (not Dye Pack) | IMPL | Naming throughout. |
| Charcoal/amber/hexagon, tagline | IMPL | |
| Simple status + obvious next action | IMPL | Status page CTA. |

## Layered vault protection
| Requirement | Status |
|---|---|
| On-device encryption, zero-knowledge sync, independent review | UNBUILT / BLOCKED |
| Device-backed keys, biometrics/hardware keys; stronger export & enrollment verification | UNBUILT |
| Auto-lock, revoke sessions, rotate keys; preserve owner data & recovery | UNBUILT (recovery actions SIM) |
| Passkeys preferred; independent passwords elsewhere | UNBUILT |
| No unhackable/whole-OS claims; Parrot OS only test env; Ghost/Dragon unidentified | DOC (Ghost/Dragon: not referenced in app) |

## Digital Honey Pack
| Requirement | Status |
|---|---|
| Decoys for controlled service; alert with time/address/details | SIM (sample events) |
| Offline copy may not trigger; decoy use ≠ proof of theft/intent/identity; false positives | DOC |
| No destructive payloads/propagation; evidence kept separately | DOC |

## Lost-device protection
| Requirement | Status |
|---|---|
| Phones/iPads/computers via supported capabilities | DOC |
| Recovery from another device, auth not solely on lost device | SIM (UI) / UNBUILT (auth) |
| Revoke future access; OS lock guidance; no whole-device control | SIM / DOC |
| Local encryption + auto-lock for downloaded data; no recall of exposed secrets | DOC / UNBUILT |
| Confirmed/pending/offline/failed shown distinctly | SIM |
| No automatic destruction | DOC |

## Location & device-seen-again
| Requirement | Status |
|---|---|
| Cryptographic device identity, not IP | SIM (sample key fingerprints) |
| Authenticated check-in, IP + permitted location, timestamp/accuracy, stale label | SIM |
| No guaranteed background reporting | DOC |
| Locate + UWB Find Nearby; 5–10 ft test goal | UNBUILT (button disabled) / DOC |
| Offline needs relay; no Find My; VPN masking; enrollment before loss | DOC |

## Evidence & legal
| Requirement | Status |
|---|---|
| Tamper-evident events, signed check-ins, collection history, owner-documented losses | SIM (sample export has collection history); tamper-evidence UNBUILT |
| Report separates observations / suspicions / **missing records** / corroborated | SIM — "missing records" added this pass |
| IP/unlock ≠ attribution; legal remedies fact-dependent; no automatic claim/prosecution/compensation; no hack-back | DOC — legal wording added this pass |
| Legal/insurance partners separate | DOC |
| AI-organized incident timeline | IMPL but DISABLED (owner authorization pending) |

## Pricing & partners
| Requirement | Status |
|---|---|
| Individual/Household proposals; not validated margins | DOC (wording added) |
| VPN later, outside core | DOC |
| Malwarebytes affiliate interest only; no application/link/bundle; scanning outside core | DOC (wording added; no external link inserted) |
| Terminal separate ($20/yr belongs to Terminal plan, not shown in Vault pricing) | IMPL (not mixed) |
| One-way discreet Terminal card; none in password/security/recovery flows; no Vault ads in Terminal | IMPL — card renders only on Status and Roadmap pages |

## Open owner inputs (also in PLAN_AUTH_CRYPTO.md)
- Meaning of "user-created passwords" — preview currently supports both manual entry and preference-based generation.
- First supported desktop browser(s) and first supported websites.
- Vault/sync architecture choice and recovery strategy (see plan options).

## Wallet and accounts addenda (2026-10-25)
| Requirement | Status | Evidence / gate |
|---|---|---|
| Wallet Protection submitted and queued without bypassing pauses | DOC | SPEC.md, roadmap.md, docs/WALLET_PROTECTION.md |
| Masked sample references, locked view, unlock/auto-lock | SIM | /wallet-protection; wallet-demo.test.ts; not real encryption/auth |
| Native biometrics, device fallback, action-specific step-up | DESIGN / SIM / BLOCKED | OS API references + demo outcome/action/expiry tests; no biometric collection; native implementation/review unbuilt |
| Session revocation, access history | SIM | In-memory this-page-only Vault state; no wallet transactions controlled |
| Android/iOS provisioning/NFC | UNBUILT / BLOCKED | Primary-source assessment with unresolved entitlement/provider/region/eligibility; unavailable in web preview |
| Sensitive payment/biometric data exclusion | IMPL (preview boundary) / DESIGN | Fixed masked data, no payment entry/persistence; real storage/log review required before scope expansion |
| Real accounts and activity requested | SUBMITTED / BLOCKED | Cloud connected; awaiting profile decision and implementation/configuration verification; no SSO or encryption implied |
