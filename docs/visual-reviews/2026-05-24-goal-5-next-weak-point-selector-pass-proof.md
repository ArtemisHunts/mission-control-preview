# Goal 5 Next Weak Point Selector Pass

- Date: 2026-05-24 19:23 UTC
- Lane: Goal 5 holo-table / overlay / reference-match
- Surface: `?overlay=1&console=overview`
- Verdict: partial-match-improved, not reference-complete

## Selected Gap

The latest Goal 5 reference state had proof for the motif contrast calibration pass, but the overlay did not expose the next weak-point decision in the Command Table Core. This pass adds a read-only, state-backed selector so the next table-first / peripheral / motif pass is visible in the operational surface.

## Implementation

- Added `reference-scale-next-weak-point-lock` inside the Command Table Core.
- Renders the canonical next step from `referenceMatch.goal5.nextStep`.
- Renders the central table, peripheral ops band, and visual motif zone gaps as selector chips.
- Kept the selector read-only; it does not create fake backend actions.

## Proof Paths

- `docs/visual-reviews/2026-05-24-goal-5-next-weak-point-selector-pass-proof.md`
- `docs/visual-reviews/2026-05-24-goal-5-next-weak-point-selector-pass-proof.json`
- `docs/visual-reviews/2026-05-24-goal-5-next-weak-point-selector-pass-desktop.png`
- `docs/visual-reviews/2026-05-24-goal-5-next-weak-point-selector-pass-mobile.png`
- `tmp/goal-5-next-weak-point-selector-pass-dom.html`

## Smoke Markers

- `reference-scale-next-weak-point-lock`
- `State-backed next weak point selector`
- `next weak point`
- `selected gap`
- `candidate 2`
- `candidate 3`

## Next Step

Use the selector to drive the next UI pass into the selected table-first hierarchy gap.
