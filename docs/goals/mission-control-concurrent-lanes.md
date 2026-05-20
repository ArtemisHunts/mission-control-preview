# Mission Control Concurrent Goal Lanes

_Created: 2026-05-19_

## Lane Split

Mission Control now runs two concurrent development lanes instead of treating the holo-table overlay as blocked by 3D work.

### Overlay Lane

- **Channel:** `#dashboard` (`1477048686851784858`)
- **Goal:** `goal-5-holo-table-density-kanban`
- **Purpose:** Improve the holo-table command overlay: dense overview, task flow, goal lanes, review pressure, roster, telemetry, and local preview actions.
- **Primary files:** `app.js`, `style.css`, `mission-control-state.json`, `tasks/todo.md`
- **Preview path:** `?overlay=1&console=overview`
- **Stop rule:** Do not fake backend actions or claim external automation that is only local preview state.
- **Reporting boundary:** Do not post 3D / asteroid / Meshy / Blender / GLB / facility-asset progress in #dashboard. This lane is for Goal 5 holo-table updates only.

### 3D Lane

- **Channel:** `<#1477048876669075578>`
- **Goal:** `goal-6-high-fidelity-asteroid-baseline`
- **Purpose:** Prove and improve the asteroid/facility runtime scene, starting with the Meshy-101 browser/in-scene proof.
- **Primary files:** `assets/blender/**`, `docs/visual-reviews/**`, `scripts/create-*`, `scripts/render-*`
- **Stop rule:** No paid Meshy generation, public deploy, or push without explicit approval/evidence.
- **Reporting boundary:** Do not post Goal 5 holo-table / overlay / UI / kanban / reference-match progress in the 3D channel unless it directly blocks 3D runtime proof.

## Scheduler Contract

- `mission-control-holo-table-dashboard-2h-update` reports Goal 5 only to #dashboard.
- `mission-control-holo-table-autonomous-build-loop` executes Goal 5 only and reports to #dashboard.
- `mission-control-3d-2h-update` reports Goal 6 only to <#1477048876669075578>.
- `mission-control-3d-autonomous-build-loop` executes Goal 6 only and reports to <#1477048876669075578>.
- Any future cron/job prompt must include the same hard lane boundary before it is enabled.

## Verification

- Overlay lane: `node scripts/validate-mission-state.mjs`, `node --check app.js`, browser screenshot/DOM smoke for `?overlay=1&console=overview`.
- 3D lane: Blender/glTF inspection, browser scene smoke, visual proof board, then state update.
