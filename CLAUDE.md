# igi-drills — IGI Drills (sales training)

> Suite-wide context: `../IGI-SUITE.md`. Read that first.

**What this is:** interactive sales-training drills for the Ignite sales team.

- **Hosting:** Vercel (the only IGI tool not on GitHub Pages) — deploys via Vercel on push
- **Backend:** its own `/api` routes (Vercel functions), gated by shared-secret auth (added 2026-05-24) — this is the one exception to the "Intel Engine only" rule, predating that architecture; new backend features still go to the Intel Engine
- Low change velocity — last feature work 2026-05-24.

## Notes
- Feature-level changes: append one line to `../igi-docs/IGI_Changelog.md`.
