# Spam Shield — private sample preview

## Implemented / simulated
`/spam-shield` offers separate sample Quarantine/Inbox/Sender views, SMS/email controls, restore, sender block/unblock and allowlist. Fixed fictional messages and rules stay in page memory; refresh/navigation resets them. Nothing reads a real inbox, device SMS, attachments or links; no message API or permission request exists. Verification and important sample messages bypass quarantine, including blocked senders. Real classifiers cannot guarantee perfect recognition: conservative handling, explainable decisions, accessible review and false-positive recovery are mandatory before integration.

Unsubscribe is an explicit two-step Demo action for trusted marketing samples only. Suspicious senders have no unsubscribe action. Confirmation only records transient sample state; no URL is present or opened and no request is sent. Future provider actions must validate authenticated unsubscribe metadata and destinations, defend against spoofing/redirects, and ask the user before sending/following anything. Unsubscribe is not sender trust or deletion.

Quiet Mode changes the sample notification policy: routine notices muted, verification/important notices retained. It grants no permissions and does not change OS notifications. Settings remain visible and keyboard accessible; future implementations must not hide from system settings or bypass permission prompts. Mechanical hive is opt-in/off by default, 3.2 seconds maximum including staggered cell lighting/fading, decorative SVG with gold and silver robotic bees. Reduced motion renders it static and disables playback; motion changes stop playback. No global boot or launch overlay exists.

Both channels always show **Demo / not connected**. There is no active protection. Future “Protection active” requires real per-channel checks: valid consent/role/scopes, healthy processing/watch/check-in with timestamp/freshness, expected reversible action readback, and loss-of-permission/offline/error handling. Controls, login or animation alone cannot enable that status. SMS and email health must remain independent; degraded/stale/disconnected states must replace active status. Never infer health from an enabled preference.

## Native/email prerequisites (unbuilt)
| Surface | Scope, prerequisites and limits |
|---|---|
| Android | Native app qualifying for the user-selected default SMS role, required handler intents, explicit permissions and Play eligibility review. Role-loss/revocation must stop processing. No general filtering of another SMS app or RCS promised. Native storage, quarantine, sender rules and code/important-message handling need security and device tests. |
| iOS | Native IdentityLookup message-filter extension, user enabled in Settings. Unknown-sender SMS/MMS only, not contacts/iMessage. Extension cannot directly network or write shared-container data; optional system-mediated server classification needs separate privacy authorization. System categories are not a guarantee of an app-owned cross-device quarantine; inspect supported restore/allowlist affordances before promising parity. |
| iPadOS | Animation on app open only. SMS/MMS extension/device/continuity availability needs actual target-device validation; no universal iPad message filtering claim. |
| Gmail | Per-user OAuth with narrow required mailbox scopes, provider verification/security assessment where required, secure token handling, consent/revoke controls, Pub/Sub watches/renewal and reconciliation. Reversible label/move/readback paths; not Lovable's outbound email service. |
| Outlook | Separate per-user authorization and Microsoft Graph mailbox scope; move operations require Mail.ReadWrite. Subscription renewal, synchronization, reversible folder actions and permission loss tests. |
| macOS Mail | Native MailKit extension with user enablement and supported message actions. Not an iOS Mail extension. |
| Desktop companion | Future signed native companion may start after user login only with explicit opt-in, visible settings and disable/uninstall control. Browser extension workers are short-lived/event-driven; no universal inbox or OS access. |

No provider connection, native artifact, message storage, account schema change, cross-device rules/sync or production notifications are implemented. Provider/platform selection, eligibility, consent design, retention/encryption, key/recovery review and authorization for any external service remain blockers. Real messages may contain verification codes and other secrets: never log bodies/attachments, keep data separate from vault credentials, minimize collection, and complete independent review before live message access.

## Cross-device startup / background behavior
- Desktop: only after login with consent, no hidden daemon or universal startup overlay.
- Android: boot receivers do not grant unlimited execution; background/foreground-service restrictions, Doze, force-stop, battery and OEM behavior apply. Event-driven processing and target-version testing required; never promise uninterrupted boot/background protection or an overlay.
- iOS/iPadOS: optional animation on app open; no boot overlay or always-running app guarantee. Background work is system scheduled, not a persistence bypass.
- Demo controls are page-local, not shared across devices. Future synchronized settings require explicit scope, isolation, conflict handling and per-device/channel health; one healthy device cannot prove every device protected.

## Primary references (reviewed 2026-10-25; eligibility not established)
- Android Telephony/default handlers: https://developer.android.com/reference/android/provider/Telephony and https://developer.android.com/guide/topics/permissions/default-handlers
- Android boot exceptions: https://developer.android.com/develop/background-work/background-tasks/broadcasts/broadcast-exceptions
- Android background service limits: https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start and https://developer.android.com/about/versions/15/behavior-changes-15
- Apple SMS/MMS scope: https://developer.apple.com/documentation/identitylookup/sms-and-mms-message-filtering
- MailKit: https://developer.apple.com/videos/play/wwdc2021/10168/
- Gmail scopes/watch: https://developers.google.com/workspace/gmail/api/auth/scopes and https://developers.google.com/workspace/gmail/api/guides/push
- Graph mailbox/move: https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview and https://learn.microsoft.com/en-us/graph/api/message-move
- Chrome worker lifecycle: https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle

## Acceptance
Pure policy tests cover marketing quarantine, protected codes/important messages under block, restore, allow/unblock, independent channel controls, explicit trusted unsubscribe, suspicious denial, Quiet Mode and never-active Demo health. Browser checks must cover restore/readback, block/allowlist, channel toggles, confirmation/cancel, quiet and reduced-motion behavior at desktop/tablet/phone sizes. Native/provider health and real notification delivery remain unverified.