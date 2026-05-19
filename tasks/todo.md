# Mission Control Master Goal Todo

_Last updated: 2026-05-19_

## Active Plan

- [x] Inspect current state loading/render bindings and existing seed data.
- [x] Add canonical mission-control-state.json with real goal/event entities and explicit demo flags.
- [x] Add runtime state adapter that normalizes canonical state into legacy app fields.
- [x] Bind existing UI/facility reads to the normalized state without breaking the scene.
- [x] Run syntax/state smoke checks and record Goal 2 progress.

## Current Goal

Mission Control v1 local operating-system pass.

Done when:
- canonical state loads into the console
- goals can be selected and locally drafted
- assignments, events, reviews, telemetry, and artifacts are visible and truthful
- local/runtime event files can update canonical state through a reviewable bridge

## Review - 2026-05-18 Goal 2

- Added app.js runtime adapter for mission-control-state.json with legacy fallback.
- Bound existing dock/readout modes to canonical goals, runs, tasks, events, assets, reviews, and telemetry.
- Recorded Goal 2 completion in mission-control-state.json.
- Verified: node scripts/validate-mission-state.mjs, node --check app.js, HTTP JSON/app fetch checks.
- Not verified: browser-rendered smoke, because OpenClaw browser policy blocked localhost navigation.

## Review - 2026-05-18 Goal 3

- Added central console hotspot and Holo-table dock path to open the Mission Control console.
- Added holographic overlay shell with close/backdrop/Escape behavior and state-backed tabs.
- Panels now expose overview, mission map, agents, tasks, review, telemetry, signals, deploy, and buildout state from mission-control-state.json.
- Added renderer fallback so WebGL failure does not prevent the state UI from loading.
- Verified: node scripts/validate-mission-state.mjs, node --check app.js, HTTP state fetch, headless Chrome desktop screenshot, headless Chrome mobile screenshot.

## Next Implementation Lane

Backend/OpenClaw event ingestion. The local preview foundation now persists assignment events and patches in browser localStorage, but the real bridge still needs a backend/runtime event source.

Next checklist:
- [x] Add browser-localStorage preview persistence for assignment/progress events.
- [x] Define the backend/OpenClaw event ingestion boundary.
- [x] Add durable backend write path for task assignment/progress events.
- [x] Preserve local preview fallback when live event bridge is unavailable.
- [x] Verify state reload reflects assigned/progressed tasks after refresh.

## Review - 2026-05-18 Goal 4

- Added assignment scoring from task skills/tags, trust, availability, load, demo status, and risk mismatch.
- Added console recommendations in the task and agent panels.
- Added local in-memory assignment buttons that update task/agent state and emit a visible local event.
- Kept persistence honest: assignment actions explicitly say browser-session-only until the event bridge lands.
- Verified: node scripts/validate-mission-state.mjs, node --check app.js, headless Chrome task screenshot, DOM checks for assignment actions and agent fit scoring.

## Review - 2026-05-18 Local Event Bridge Foundation

- Added browser-localStorage persistence for local assignment events and task/agent patches.
- Canonical JSON still loads first; local patches merge over it for preview persistence.
- Telemetry panel now exposes local bridge mode, persisted event count, patch status, and a reset action.
- Kept scope honest: this is local preview persistence, not backend/OpenClaw ingestion.
- Verified: node scripts/validate-mission-state.mjs, node --check app.js, headless Chrome telemetry DOM check.

## Review - 2026-05-18 Durable Event Ingestion Boundary

- Added scripts/apply-mission-events.mjs as the durable local backend/runtime write path for Mission Control events.
- Supported task.recorded, task.assigned, task.status_changed, task.progress_reported, goal.checkpoint, and artifact.recorded event types.
- Added docs/goals/mission-control-event-ingestion.md and a sample event batch.
- Used the ingestion script to record its own task, artifact, checkpoint, and verification events into canonical state.
- Kept scope honest: this is a local durable ingestion boundary, not a live OpenClaw streaming adapter yet.
- Verified: dry-run sample ingestion, applied canonical event batch, node scripts/validate-mission-state.mjs, node --check scripts/apply-mission-events.mjs, node --check app.js.

## Review - 2026-05-18 Goal 7 Review Gates

- Extended durable event ingestion with review.recorded and review.status_changed event types.
- Added validator checks for review goal/task/requesting-agent references.
- Added real review records for public GitHub deploy/push, paid external generation, and credential-sensitive actions.
- Expanded the Review console panel to show review status, decision state, risk level, required approvals, and approval evidence.
- Kept approvals truthful: all risky external actions remain pending Michael approval, not auto-approved.
- Verified: canonical event ingestion batch, node scripts/validate-mission-state.mjs, node --check scripts/apply-mission-events.mjs, node --check app.js, headless Chrome review-panel DOM/screenshot smoke.

## Review - 2026-05-18 Goal Intake / Selection

- Added selected-goal state for the command console.
- Added Select actions in the overview and mission-map panels.
- Added a local Goal Intake action that creates browser-local goal drafts plus an initial intake task.
- Local goal drafts persist through the existing localStorage bridge and remain clearly labeled as local preview state.
- Recorded the work through the durable event ingestion script.
- Verified: CDP browser smoke opened the console, clicked Create Goal with prompt stubs, confirmed localStorage goal/task drafts, selected goal state, rendered goal text, and local preview labeling.

## Current Remaining Work

- Mission Control v1 local operating-system pass is shipped to GitHub Pages for visual inspection.
- Active direction has pivoted to the holo-table + 3D asset campaign:
  - make the holo-table closer to the shared holographic reference
  - keep more operational information on one page with fewer tab hops
  - present tasks kanban-style
  - audit or replace the asteroid baseline before adding more facility dressing
  - populate the accepted asteroid baseline with the existing Meshy asset/library pieces
- 3D pipeline updates should be posted in <#1477048876669075578>.

## Active Plan - Holo-Table + 3D Asset Campaign

- [x] Audit current asteroid candidates and decide whether any existing high-poly/source asset can beat `meshy-19`.
- [x] Confirm Meshy spend approval before launching any new high-fidelity paid asteroid generation; the previous lane cap was reopened to the 4000 credits/month account limit in current state.
- [x] Record the approved high-fidelity Meshy asteroid candidates and compare them against the current baseline with contact-sheet proof.
- [x] Record the asteroid baseline audit/proof and promote the strongest candidate only as a cleanup candidate, not a final accepted baseline.
- [ ] Rework the command console into a denser single-page holo-table surface with fewer tabs.
- [ ] Convert the task panel into kanban columns.
- [ ] Inventory existing Meshy facility-library assets by role and pick the first population pass.
- [ ] Install the strongest library assets into the accepted asteroid baseline and produce a visual review board.

## Review - 2026-05-18 Live Filesystem Event Bridge

- Added scripts/watch-mission-events.mjs as a local live bridge over mission-events/inbox.
- Successful event files are applied through scripts/apply-mission-events.mjs and archived to mission-events/processed.
- Failed event files and error logs archive to mission-events/failed.
- Added docs/goals/mission-control-live-event-bridge.md and tracked inbox/processed/failed directories.
- Verified: node --check scripts/watch-mission-events.mjs, watcher --once smoke with a real inbox event, archive movement, and node scripts/validate-mission-state.mjs.

## Review - 2026-05-19 Asteroid Baseline Audit Proof

- Selected the recovery-focus gap: asteroid baseline audit/proof was present as loose images/assets but not recorded as a canonical visual review.
- Added `docs/visual-reviews/2026-05-19-asteroid-baseline-audit-proof.md` with candidate paths, proof boards, Blender metrics, verdict, and next-step decision.
- Audited four candidates: current `meshy-19`, local `core-clean-v6`, Meshy high-fidelity v1, and Meshy open-front v2.
- Decision: keep `meshy-19` as live placeholder, promote `meshy-101-open-front-v2` as the cleanup candidate, and keep facility population blocked until Blender cleanup/export accepts a source and runtime GLB.
- Verification: Blender 5.1.1 GLB import/metrics audit, node scripts/validate-mission-state.mjs, node --check app.js.
