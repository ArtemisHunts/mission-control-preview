# Mission Control — Current State Audit

_Last updated: 2026-05-16_
_Status: Goal 0 audit_

## Summary

Mission Control currently exists as a visually ambitious Three.js asteroid facility preview with substantial art-direction documentation and many Blender/Meshy-related assets. It does **not yet** function as a real goal-driven operating system. The current state model is mostly static/demo data in `state.json`, and the UI/runtime does not yet expose a real holographic command console, goal lifecycle, Codex execution state, event stream, or review gates.

## What exists

### Runtime preview

- `app.js` — large Three.js scene implementation.
- `state.json` — seed/demo agents, tasks, and activity.
- `README.md` — public preview note.

### Product/design docs

- `docs/target-design-spec.md` — main 3D environment/north-star spec.
- `docs/autonomous-development-loop.md` — prior autonomous macro-pass workflow.
- `docs/macro-phase-plan.md` — macro gates and visual proof policy.
- `docs/concept-to-3d-asset-pipeline.md` — concept-to-asset process.
- `docs/design-inspiration-board.md` — reference/inspiration layer.

### Art direction / asset pipeline

- `docs/art-direction/*` — Meshy plans, asset-library docs, credit ledger, pilot plans, hero module notes.
- `assets/blender/*` — many `.blend`, `.glb`, and asset report files from previous asteroid/facility/modeling passes.
- `docs/visual-reviews/*` — many historical visual review notes and screenshots/reports.

## What is demo/static today

- Agent list and task list in `state.json` are seed state, not live operational truth.
- Agent statuses are not connected to real Codex/OpenClaw execution events.
- Facility behavior is not driven by real goal/task lifecycle events.
- No verified backend state/event model exists in this repo yet.
- No goal-run artifact pipeline exists yet.
- No review/approval gate exists yet.
- Holographic command console is not yet implemented as the actual functional surface.

## Runtime status

For this channel, **Codex GPT-5.5 inside OpenClaw is the active runtime**.

Important distinction:
- The current assistant/channel can execute Codex-runtime work.
- The external `@openai/codex` CLI child process exists but needs its own auth before it can run as a subordinate adapter.

This campaign should proceed using the current Codex channel runtime, while leaving the CLI adapter as optional future plumbing.

## Core gaps

### 1. Goal operating system

Missing:
- goal schema
- goal lifecycle
- goal events
- goal artifacts
- verification state
- pause/resume/block/review handling

### 2. Holographic command console

Missing:
- central table click target
- translucent overlay
- functional panels
- panel binding to canonical state
- facility buildout/asset pipeline panel

### 3. Backend/local state layer

Missing:
- durable local data model
- canonical source of truth
- event append log
- demo-vs-real flags

### 4. Codex runtime adapter/policy

Missing:
- explicit runtime contract
- what this channel executes directly
- what a future Codex CLI child process would execute
- how outputs/artifacts/events are captured

### 5. AAA facility buildout pipeline

Partially exists:
- many assets and docs
- visual review history
- target spec

Missing:
- current asset inventory verdict
- approved concept/model queue
- GPT Image 2 concept generation plan tied to actual facility modules
- Meshy.ai asset generation/refinement queue tied to reusable modules
- integration checklist for replacing primitives with optimized GLBs
- dashboard panel for facility build progress

## Recommended immediate sequence

1. **Goal 1:** Codex runtime policy + goal-runner design.
2. **Goal 2:** Minimal local state/event model.
3. **Goal 3:** Clickable central command console + holographic overlay shell.
4. **Goal 5A:** Asset inventory for existing Blender/GLB/Meshy materials.
5. **Goal 5B:** Facility concept/model queue for GPT Image 2 + Meshy.ai.

## Risks

- Visual ambition can outrun operational substance. The console must become real, not another decorative HUD.
- External generation tools can burn time/credits if not gated by specific module briefs.
- Existing assets may include many experiments; an inventory/pass-fail verdict is needed before reuse.
- If the Codex CLI child adapter is treated as mandatory, auth friction can block progress unnecessarily. Current channel Codex runtime avoids that.

## Verification from this pass

To run after creating/updating docs:

```bash
git diff --check
node --check --input-type=module < app.js
```
