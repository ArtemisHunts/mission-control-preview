# Goal 5 Command-Lens Drill-Down Controls

Date: 2026-05-21 11:55 UTC
Lane: Goal 5 holo-table / overlay / command-table UI
Route: `?overlay=1&console=overview`

## Gap Picked

The command-table core had a state-backed drill-down hierarchy, but the rows were still passive labels. That made the table read as a dense status plate instead of an operator surface where the overview can hand off to the right detail panel.

## Change

- Converted the `goal`, `queue`, `gate`, and `proof` rows into read-only drill-down controls.
- Each control opens its matching existing panel: mission map, task board, review queue, or telemetry.
- Kept all values state-backed from the current overview payload.
- Added focus/hover treatment so the controls read as command-lens affordances without adding fake backend actions.

## Proof Paths

- `docs/visual-reviews/2026-05-21-goal-5-command-lens-drilldown-desktop.png`
- `docs/visual-reviews/2026-05-21-goal-5-command-lens-drilldown-mobile.png`
- `tmp/goal-5-command-lens-drilldown-dom.html`

## Verification

- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
- Headless Chrome desktop/mobile screenshots for `?overlay=1&console=overview`
- DOM smoke for `Command Table Core`, `drill-down hierarchy`, and the four drill-down button labels
