# Mission Control Master Goal Todo

_Last updated: 2026-05-18_

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

- Mission Control v1 local operating-system pass is complete enough for commit review.
- Broader AAA facility buildout remains a separate larger campaign.
- Public GitHub push/deploy remains behind the review gate until Michael approves.

## Review - 2026-05-18 Live Filesystem Event Bridge

- Added scripts/watch-mission-events.mjs as a local live bridge over mission-events/inbox.
- Successful event files are applied through scripts/apply-mission-events.mjs and archived to mission-events/processed.
- Failed event files and error logs archive to mission-events/failed.
- Added docs/goals/mission-control-live-event-bridge.md and tracked inbox/processed/failed directories.
- Verified: node --check scripts/watch-mission-events.mjs, watcher --once smoke with a real inbox event, archive movement, and node scripts/validate-mission-state.mjs.
