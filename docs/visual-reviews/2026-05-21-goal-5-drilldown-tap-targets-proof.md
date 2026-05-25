# Goal 5 Drill-Down Tap Targets

Date: 2026-05-21 16:21 UTC
Lane: Goal 5 holo-table / overlay / command-table UI
Route: `?overlay=1&console=overview`

## Gap Picked

The mobile command-lens stack was readable, but the central command-table drill-down controls still needed stronger touch affordance. The rows were functional buttons, but they were compact and visually quiet for mobile use.

## Change

- Added touch-target treatment to the state-backed `goal`, `queue`, `gate`, and `proof` drill-down rows.
- Added visible chevrons, touch-action handling, and focus/active state styling.
- Raised mobile row height to a 44px tap target and widened mobile drill-down pills.
- Kept the controls read-only and routed only to existing panels. No backend actions were added.

## Proof Paths

- `docs/visual-reviews/2026-05-21-goal-5-drilldown-tap-targets-mobile.png`
- `docs/visual-reviews/2026-05-21-goal-5-drilldown-tap-targets-desktop.png`
- `tmp/goal-5-drilldown-tap-targets-dom.html`

## Verification

- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
- Headless Chrome desktop/mobile screenshots for `?overlay=1&console=overview`
- DOM smoke for `Command Table Core`, `drill-down hierarchy`, and the four drill-down button labels
- CSS smoke for the 44px mobile target, chevron affordance, touch-action, and focus-visible state
- Mobile screenshot QA for visible, readable, non-overlapping controls
