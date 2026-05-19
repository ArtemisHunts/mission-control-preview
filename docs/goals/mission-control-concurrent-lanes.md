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

### 3D Lane

- **Channel:** `<#1477048876669075578>`
- **Goal:** `goal-6-high-fidelity-asteroid-baseline`
- **Purpose:** Prove and improve the asteroid/facility runtime scene, starting with the Meshy-101 browser/in-scene proof.
- **Primary files:** `assets/blender/**`, `docs/visual-reviews/**`, `scripts/create-*`, `scripts/render-*`
- **Stop rule:** No paid Meshy generation, public deploy, or push without explicit approval/evidence.

## Verification

- Overlay lane: `node scripts/validate-mission-state.mjs`, `node --check app.js`, browser screenshot/DOM smoke for `?overlay=1&console=overview`.
- 3D lane: Blender/glTF inspection, browser scene smoke, visual proof board, then state update.
