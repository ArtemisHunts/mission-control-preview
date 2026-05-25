# Goal 5 Table-First Hierarchy Lock Pass Proof - 2026-05-24

## Scope

- Lane: Goal 5 holo-table / overlay / reference-match / command-table UI.
- Gap selected: table-first hierarchy after the lower proof mass rebalance side-by-side board.
- Change: added a read-only, state-backed table-first hierarchy lock inside the Command Table Core.

## Implementation

- Added reference-scale-table-first-hierarchy-lock to the overlay overview composition.
- The lock renders three compact chips: first hierarchy, orbit restraint, and proof anchor.
- All values come from mission-control-state.json reference zones, selected goal proof counts, latest artifact/event state, and selected-lane work/review pressure.
- No fake backend actions, no public deploy, and no cross-lane work.

## Proof Paths

- Desktop overlay: docs/visual-reviews/2026-05-24-goal-5-table-first-hierarchy-lock-pass-desktop.png
- Mobile overlay: docs/visual-reviews/2026-05-24-goal-5-table-first-hierarchy-lock-pass-mobile.png
- DOM smoke: tmp/goal-5-table-first-hierarchy-lock-pass-dom.html
- Machine proof: docs/visual-reviews/2026-05-24-goal-5-table-first-hierarchy-lock-pass-proof.json

## Verdict

Partial-match-improved. The table core now has a dedicated hierarchy lock that keeps the central table first while restraining orbiting work/proof mass. This is not reference-complete; it needs a fresh side-by-side proof next.

## Verification

- node scripts/validate-mission-state.mjs
- node --check app.js
- git diff --check
- Headless Chrome overlay desktop/mobile screenshot smoke
- DOM marker smoke for ?overlay=1&console=overview
- PNG dimension/nonblank sanity
