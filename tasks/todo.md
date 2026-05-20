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
  - tighten the overview surface now that kanban task state is live
  - audit or replace the asteroid baseline before adding more facility dressing
  - populate the accepted asteroid baseline with the existing Meshy asset/library pieces
- Concurrent lane split is now explicit:
  - overlay / holo-table loop stays in #dashboard as `goal-5-holo-table-density-kanban`
  - 3D asteroid/runtime loop continues in <#1477048876669075578> as `goal-6-high-fidelity-asteroid-baseline`
  - overlay inspection can use `?overlay=1&console=overview` without loading the heavy 3D candidate

## Active Plan - Holo-Table + 3D Asset Campaign

- [x] Record Michael's approved Goal 5 reference-match contract: concept-art command table layout is the product target, not the earlier dashboard-ish density baseline.
- [x] Rebuild the overview around the command-table composition: top status band, left execution queue, right agent/review pressure, bottom evidence/events/telemetry band.
- [x] Add fresh desktop/mobile screenshot proof for ?overlay=1&console=overview and compare it against the reference-match contract.
- [x] Tighten the next visual-language pass: secondary text contrast, holographic depth, density tuning, and detail drill-down behavior.
- [x] Audit current asteroid candidates and decide whether any existing high-poly/source asset can beat `meshy-19`.
- [x] Confirm Meshy spend approval before launching any new high-fidelity paid asteroid generation; the previous lane cap was reopened to the 4000 credits/month account limit in current state.
- [x] Record the approved high-fidelity Meshy asteroid candidates and compare them against the current baseline with contact-sheet proof.
- [x] Record the asteroid baseline audit/proof and promote the strongest candidate only as a cleanup candidate, not a final accepted baseline.
- [x] Clean the Meshy-101 open-front candidate in Blender and export a normalized runtime GLB candidate.
- [x] Apply Michael's thinner-wall feedback as a separate Meshy-101 hollow v2 candidate and validate the optimized runtime GLB.
- [x] Prove the Meshy-101 runtime candidate inside the Mission Control browser scene before final baseline acceptance.
- [x] Realign local preview/runtime proof state to the clean Meshy-101 rollback after hollow v2 visual rejection.
- [ ] Generate/refine the next Meshy thin-wall hollow candidate, then use Blender only for normalization/export/proof after the form already works.
- [x] Rework the command console into a denser single-page holo-table surface with fewer tabs.
- [x] Convert the task panel into kanban columns.
- [x] Split overlay and 3D into separate channel-owned goal lanes.
- [x] Add overlay-only preview mode so holo-table work is not blocked by 3D runtime loading.
- [ ] Inventory existing Meshy facility-library assets by role and pick the first population pass.
- [ ] Install the strongest library assets into the accepted asteroid baseline and produce a visual review board.

## Review - 2026-05-19 Concurrent Overlay / 3D Lane Split

- Recorded `docs/goals/mission-control-concurrent-lanes.md` as the durable contract for the two loops.
- Routed `goal-5-holo-table-density-kanban` to #dashboard and `goal-6-high-fidelity-asteroid-baseline` to <#1477048876669075578> in canonical state.
- Added `?overlay=1&console=overview` mode so the overlay opens directly and skips the heavy 3D runtime candidate.
- Added a state-backed Goal Lanes panel to the overlay overview so channel ownership is visible inside Mission Control itself.

## Review - 2026-05-19 Meshy-101 Browser Runtime Proof

- A parallel 3D worker proved `meshy-101-open-front-hollow-runtime-v2.optimized.glb` in the browser scene with SwiftShader WebGL.
- Proof artifacts: `docs/visual-reviews/2026-05-19-meshy-101-runtime-browser-proof.md`, `docs/visual-reviews/2026-05-19-meshy-101-runtime-browser-detail-swiftshader-proof.png`, and matching JSON.
- Decision: runtime path works and Meshy-101 v2 remains the active local candidate, but it is not final-baseline accepted yet.
- Next 3D gate: superseded after visual rejection of the hollow v2 pass. Protect clean Meshy-101 as the live baseline; use Meshy prompt/refine for the next thin-wall hollow form candidate, then bring only visually viable candidates into Blender for normalization/export/proof.
- Added `docs/goals/meshy-101-interior-cleanup-brief.md`, but treat it as historical cleanup context rather than the active path after Michael's Meshy-first correction.

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

## Review - 2026-05-19 Meshy-101 Cleanup Export Proof

- Finished the interrupted Meshy-101 cleanup/export lane instead of skipping ahead to holo-table work.
- Fixed `scripts/create-meshy-101-open-front-cleanup-proof-v1.py` so the metrics JSON writes a real newline and parses with `jq`.
- Regenerated the Blender source, runtime GLB, proof render, and metrics report for `meshy-101-open-front-v2`.
- Runtime candidate output: `assets/blender/meshy-101-open-front-clean-runtime-v1.glb`, 6.56 MB, 136,620 uploaded vertices, 273,500 triangles, one mesh, one opaque material, no textures, no required extensions.
- Decision: cleanup/export gate passed; final baseline acceptance is still blocked on Mission Control browser/in-scene runtime load proof.
- Verification: Blender 5.1.1 generation run, `jq` metrics parse, `python3 -m py_compile`, `npx --yes @gltf-transform/cli inspect`, node state validator, app/script syntax checks, and diff checks.

## Review - 2026-05-19 Holo-Table Kanban Task Pass

- Picked the next highest-value holo-table gap after the asteroid proof work: the command console still rendered tasks as a long flat list instead of the planned kanban surface.
- Extended the console panel renderer so task panels can render custom content instead of only generic lists.
- Replaced the flat task roster with a state-backed kanban board that groups tasks into active, queued, blocked, and completed lanes, while keeping assignment actions separate.
- Added a compact task-flow snapshot and lane styling in `style.css` so the open-work state is visible in one scan without pretending any backend automation that does not exist.
- Verification: `node scripts/validate-mission-state.mjs`, `node --check app.js`, `git diff --check`.

## Review - 2026-05-19 Holo-Table Overview Density Pass

- Picked the next holo-table gap immediately after the kanban pass: the overview screen still forced too much tab-hopping to see work, risk, asset, and roster state together.
- Added an `Operations Snapshot` metric strip plus compact `Open Work`, `Review Pressure`, `Asset Pipeline`, `Command Roster`, and `Latest Events` panels directly to the overview surface.
- Added the state-backed `Task Kanban` board directly to the overview surface, while keeping the dedicated task-board tab for focused task inspection.
- Kept the data truthful and state-backed: the new surface reads from canonical goals, tasks, reviews, assets, telemetry, agents, and events without introducing fake backend actions.
- Proof artifacts: `docs/visual-reviews/2026-05-19-holo-table-density-overlay-smoke.md`, matching JSON, desktop/mobile overview screenshots, and the task-board screenshot.
- Decision: passed browser smoke; the holo-table density + kanban recovery gap is complete. Next gap returns to the Meshy-101 no-spend Blender cleanup before final asteroid baseline lock.
- Verification: `node scripts/validate-mission-state.mjs`, `node --check app.js`, `git diff --check`, and headless Chrome overlay DOM/screenshot smoke.

## Review - 2026-05-19 Goal 5 Visual-Language Pass

- Tightened the central holo-table surface instead of adding more flat cards: added layered detail cards, stronger row contrast, clearer lane selection, and explicit drill-down actions tied to real console panels.
- Reworked the overview interactions so the primary surface can jump straight into `Mission Map`, `Agents`, `Telemetry`, `Task Board`, `Review Queue`, `Buildout`, and `Signals` without abandoning the table-first composition.
- Fixed the mobile framing failure from the first screenshot pass by reordering the mobile stack around the command table and removing the clipped centered-modal layout that pushed the hero surface off-screen.
- Kept the data truthful and state-backed: the pass improved rendering, interaction, and responsive layout only; it did not invent backend automation or synthetic state.
- Proof artifacts: `docs/visual-reviews/2026-05-19-goal-5-visual-language-pass-proof.md`, desktop/mobile screenshots, and `tmp/goal-5-visual-language-dom.html`.
- Decision: pass. Goal 5's reference-match overlay lane is now browser-proven and can hand focus back to the Meshy-101 cleanup/final-baseline path.
- Verification: `node scripts/validate-mission-state.mjs`, `node --check app.js`, `git diff --check`, headless Chrome desktop/mobile screenshots, and DOM smoke for `Mission Map`, `Open Task Board`, `Open Review`, and `Telemetry`.

## Review - 2026-05-19 Meshy-101 Interior Cleanup Brief

- Picked the next active 3D lane after Goal 5 closed: the baseline is still blocked on one no-spend Blender cleanup pass, but the exact edit target was spread across multiple proof notes.
- Added `docs/goals/meshy-101-interior-cleanup-brief.md` as a single execution brief with exact scope, no-spend guardrails, do-not-do list, suggested output names, verification floor, and acceptance rule.
- Kept the artifact honest: this does not claim the cleanup itself is done; it simply makes the next 3D pass faster and less error-prone by turning the blocker into an explicit checklist.
- Decision: useful progress, but `task-meshy-101-interior-cleanup` remains active until the Blender/export/browser repeat pass is actually completed.
- Verification: direct readback of the brief plus existing task/goal state confirms the new brief matches the current blocker and next-gate language.

## Review - 2026-05-19 Meshy-101 Deterministic Camera URL Support

- Tightened the runtime-proof loop itself instead of adding another manual checklist: `app.js` now accepts `?camera=detail|full|wide|ceiling` and applies the preset on load.
- Updated the existing runtime-proof note and historical cleanup brief so the next browser rerun can use `http://127.0.0.1:4177/?camera=detail` as a deterministic framing path.
- Added proof artifacts: `docs/visual-reviews/2026-05-19-meshy-101-camera-url-proof.md`, matching JSON, and screenshot.
- Kept the change honest: this does not prove a new asteroid form or accept the baseline; it only removes one avoidable manual camera step from the next Meshy-first candidate proof rerun.
- Decision: useful tooling progress. Goal 6 still remains blocked on a visually viable Meshy thin-wall hollow candidate plus Blender normalization/export/browser proof.
- Verification: `node --check app.js`, `node scripts/validate-mission-state.mjs`, `git diff --check`, clean GLB HTTP 200 check, PNG/file check, and headless Chrome DOM proof showing `DETAIL · 40m` at `?camera=detail`.

## Review - 2026-05-19 Meshy-First 3D Direction Correction

- The hollow v2 visual pass failed; Michael explicitly rejected the live image and correctly challenged whether Blender should be used for form-language changes.
- Live preview was rolled back to the clean Meshy-101 baseline on GitHub Pages via `b2d6a65`; live `app.js` now references `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`.
- Updated the active 3D path: Blender remains for cleanup, scale, pivots, decimation, material sanity, runtime export, and proofing; Meshy prompt/refine should drive the next thin-wall hollow asteroid form iteration.
- Facility population remains blocked until a visually accepted asteroid baseline passes local review and browser proof.
- Verification: live Pages `app.js` returns 200 and references the clean runtime GLB; clean runtime GLB returns 200.

## Review - 2026-05-19 Meshy-101 Next Form Brief

- Picked the active Goal 6 blocker directly from current state: the next task is no longer Blender cleanup, it is a Meshy-first thin-wall hollow form iteration.
- Added `docs/goals/meshy-101-next-meshy-form-brief.md` so the next paid/refine pass has one explicit target instead of being scattered across rejection notes and historical cleanup docs.
- Locked the brief to the real acceptance bar: thinner shell walls, deeper interior volume, less slab/boolean reading, preserved open-front silhouette, and no Blender work until a visually viable Meshy result exists.
- Kept the artifact honest: this is a direction/quality brief only. It does not claim that a new candidate was generated or accepted.
- Verification: direct readback of current goal/task state plus doc write; canonical state still requires the actual Meshy candidate, then Blender normalization/export/browser proof.

## Review - 2026-05-19 Meshy-101 Next Form Submission Pack

- Converted the active Goal 6 brief into an operational next-step pack instead of leaving it as prose only.
- Added `scripts/submit-meshy-101-thinwall-hollow-v3.py` with an explicit no-spend default: dry-run writes the create spec, while real Meshy submission requires `--submit`.
- Materialized `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.create-spec.json` and recorded the pack in `docs/visual-reviews/2026-05-19-meshy-101-next-form-submission-pack.md`.
- Fed the same explicit dry-run/submit path back into `docs/goals/meshy-101-next-meshy-form-brief.md` so the active brief itself now points straight at the real script/spec instead of making the operator hunt through later proof notes.
- Captured a fresh Goal 6 runtime-health screenshot at `docs/visual-reviews/2026-05-20-goal-6-meshy-next-form-browser-smoke-detail.png` and recorded the proof note in `docs/visual-reviews/2026-05-20-goal-6-meshy-next-form-browser-smoke.md`.
- Kept the scope honest: this prepares the next paid/refine move without claiming that a new candidate already exists.
- Verification: dry-run script output, Python compile check, `node scripts/validate-mission-state.mjs`, `node --check app.js`, and `git diff --check`.

## Review - 2026-05-20 Meshy-102 Thin-Wall Preview

- Picked the active Goal 6 blocker: generate/refine the next Meshy thin-wall hollow asteroid candidate before doing any Blender normalization/export or facility population.
- Used the approved Meshy lane to submit `102-thinwall-open-front-hollow-asteroid-v3`; task `019e442e-be27-7c3a-acce-874c957f8727` succeeded and consumed `20` credits.
- Downloaded source artifacts: `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.meshy.glb`, thumbnail, create response, and task JSON.
- Added Blender inspection/proof only: `scripts/render-meshy-102-thinwall-preview-proof.py`, `assets/blender/meshy-102-thinwall-preview-inspection.blend`, and `docs/visual-reviews/2026-05-20-meshy-102-thinwall-preview-proof.*`.
- Decision: failed visual acceptance. The silhouette is usable, but the walls still read too thick and the interior is dominated by a smooth slab/floor instead of fractured layered rock.
- Facility population remains blocked. Next unblock is another Meshy prompt/refine pass that suppresses smooth floor slabs and pushes thinner broken rock walls.

## Review - 2026-05-19 Clean Meshy-101 Local Rollback Proof

- Picked the highest-risk 3D gap after the Meshy-first correction: local Mission Control still referenced the rejected hollow v2 runtime path even though state/live direction had rolled back to clean Meshy-101.
- Updated local `app.js` to load `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`.
- Added proof artifacts: `docs/visual-reviews/2026-05-19-meshy-101-clean-baseline-local-rollback-proof.md`, matching JSON, and browser screenshot.
- Updated canonical state so the old Blender cleanup task is blocked as historical context and the active next task is Meshy-first thin-wall hollow form refinement.
- Decision: passed local rollback proof; this is not final asteroid acceptance and does not unblock facility population.
- Verification: `node scripts/validate-mission-state.mjs`, `node --check app.js`, clean GLB HTTP 200 check, and headless Chrome screenshot smoke.
