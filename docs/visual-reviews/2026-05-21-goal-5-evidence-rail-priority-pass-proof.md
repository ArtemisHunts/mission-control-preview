# Goal 5 Evidence Rail Priority Pass Proof

Date: 2026-05-21 20:51 UTC

Scope: Goal 5 only, overlay-only command-table overview at `?overlay=1&console=overview`.

## Gap Picked

The proof/status rail existed, but the strongest proof line could still lose priority on narrow mobile screens and the rail could be overtaken by non-selected latest state.

## Change

- Scoped the rail's proof/event counts to the selected command-table goal before falling back to global state.
- Promoted the latest selected-goal proof row with an `is-primary` state so it gets extra height and two-line title space.
- Kept the rail read-only; no backend actions or fake action affordances were added.

## Proof Artifacts

- Mobile overview screenshot: `docs/visual-reviews/2026-05-21-goal-5-evidence-rail-priority-pass-mobile.png` (390 x 1200)
- Desktop overview screenshot: `docs/visual-reviews/2026-05-21-goal-5-evidence-rail-priority-pass-desktop.png` (1440 x 1100)
- DOM smoke capture: `tmp/goal-5-evidence-rail-priority-pass-dom.html`
- Machine-readable proof: `docs/visual-reviews/2026-05-21-goal-5-evidence-rail-priority-pass-proof.json`

## Smoke Results

- PASS: `Command Table Core` rendered.
- PASS: `proof/status rail` rendered.
- PASS: selected Goal 5 proof count rendered.
- PASS: primary proof row class rendered.
- PASS: proof drill-down control remained visible.
- PASS: screenshot QA confirmed the mobile overlay is nonblank, the primary proof row is readable, controls remain visible, and no incoherent overlap is visible.

## Verification

- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
- Headless Chrome desktop/mobile screenshots for `?overlay=1&console=overview`
- DOM/CSS smoke for Goal 5 evidence priority markers
- Mobile screenshot QA
