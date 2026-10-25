<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Honeycomb Vault preview logic is simulation-only: password-batch rules live in src/lib/batch.ts (pure, unit-tested) and sample data in src/lib/sample-data.ts — keeps real credential handling out until native/crypto work is reviewed.
- Spec lives in SPEC.md and the checklist in roadmap.md — owner requires an honest record of working vs mocked vs unbuilt.
- Incident-notes AI is gated server-side by INCIDENT_AI_ENABLED and notes are screened for secrets in both browser and server (src/lib/incident-notes.ts) — owner must authorize the AI service; notes are never logged.
- Docs: docs/GAP_CHECKLIST.md tracks each canonical requirement status; docs/PLAN_AUTH_CRYPTO.md is the gated security plan — update both when scope changes; no custom crypto, vetted libraries only.
- Shared visual styling belongs in src/styles.css and VaultShell; decorative geometry lives in HiveBackdrop with no interaction or accessibility exposure — keeps all preview pages consistent without changing simulation logic.
- Wallet simulation policy belongs in src/lib/wallet-demo.ts with fixed masked samples in sample-data.ts and transient page state only — keeps demo approvals distinct from real auth, cryptography, payments and audit storage.
- Real account records use Cloud SDK and owner-plus-active-session RLS with server-timestamped allow-listed activity; Demo samples stay outside account tables — enforces revocation/isolation without implying vault encryption or device enrollment.
