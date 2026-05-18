# Mission Control v1 — Codex Runtime Goal Campaign

_Last updated: 2026-05-16_
_Status: Active campaign foundation_
_Runtime policy: Codex GPT-5.5 in this OpenClaw channel is the execution runtime for now._

## Runtime clarification

For this channel, **Codex GPT-5.5 is the runtime**. The external `@openai/codex` CLI is a possible child-process runner, but it is not required for the campaign to begin here. If/when the CLI is authenticated, it can become a subordinate execution adapter. Until then, this Discord/OpenClaw session running Codex GPT-5.5 owns the goal loop.

## Overarching `/goal`

```text
/goal
GOAL:
Deliver Mission Control v1 as a Codex-driven autonomous operations system: Michael sets strategic goals, Artemis/Codex decomposes and sequences them, specialist agents/runtimes execute, and the 3D asteroid facility plus holographic command console expose truthful state for goals, agents, tasks, reviews, telemetry, artifacts, and facility build progress.

CONTEXT:
- Repo: /home/agent-artemis/clawd/mission-control-preview
- Current product: Three.js asteroid operations facility preview with static/demo state in state.json.
- Core docs: docs/target-design-spec.md, docs/autonomous-development-loop.md, docs/macro-phase-plan.md, docs/concept-to-3d-asset-pipeline.md, docs/art-direction/*.
- Michael wants Codex used as the runtime in this channel for now.
- Michael added that AAA-quality 3D asteroid facility modeling/buildout must be a first-class goal, using GPT Image 2 + Meshy.ai + existing assets where practical.

CONSTRAINTS:
- No fake autonomy and no fake visibility.
- Codex is the active runtime for this channel.
- Spark self-improvement loops are not the v1 foundation.
- Do not claim GPT Image 2, Meshy.ai, deploys, or external actions have run unless they actually have.
- Preserve existing visual work unless a goal explicitly replaces or upgrades it.
- Public-facing / destructive / credential-touching actions require review.

PRIORITY:
1. Establish the goal operating system.
2. Build the holographic command console as the real functional surface.
3. Connect goals, agents, tasks, events, reviews, telemetry, and artifacts.
4. Raise the asteroid facility toward AAA quality through concept/model/asset iteration.
5. Verify every major goal with tests, screenshots, visual reviews, or artifact proof.

DONE WHEN:
A user can open Mission Control, click the central command console, create a goal, assign/run it through Codex-managed execution, inspect live task/agent/event state, review artifacts, and see the 3D facility reflect real operational state instead of demo theater.

VERIFY:
- Code checks for changed runtime files.
- Visual review gates for facility work.
- State/event audit for operating-system work.
- Explicit final proof per sub-goal.

STOP RULES:
- Stop on secrets/API-key requirements.
- Stop before paid external generation unless approved.
- Stop on architecture ambiguity that could force a broad rewrite.
- Do not expand scope after the active goal is satisfied.
```

## Sequential sub-goals

### Goal 0 — Campaign foundation + repo audit

**Purpose:** Establish the executable campaign and audit the current repo state.

**Done when:**
- This campaign document exists.
- `mission-control-current-state-audit.md` exists.
- Current static/demo areas, build gaps, and next actions are identified.

**Verification:**
- `git diff --check`
- `node --check --input-type=module < app.js`

---

### Goal 1 — Codex runtime policy + goal runner design

**Purpose:** Implement Codex as the exclusive runtime for this channel and design the eventual adapter boundary.

**Runtime stance:**
- Current active runtime: this Codex GPT-5.5/OpenClaw channel.
- Optional later child runtime: authenticated `@openai/codex` CLI.
- Mission Control owns canonical state; Codex owns execution.

**Deliverables:**
- Goal schema.
- Goal lifecycle states.
- Runtime adapter interface.
- Event contract for goal execution.
- Channel-specific rule: no non-Codex autonomous worker may execute implementation goals unless Michael changes the policy.

**Lifecycle:**
`Draft -> Planned -> Running -> Verifying -> Review -> Done`

Failure/holding states:
`Paused`, `Blocked`, `Failed`, `Needs Human Decision`.

---

### Goal 2 — Backend state/event model

**Purpose:** Make Mission Control an operational system, not just a visual scene.

**Minimum entities:**
- agents
- goals
- goal_runs
- goal_events
- tasks
- reviews
- artifacts
- telemetry
- facility_assets
- visual_reviews

**Done when:**
- Local data model exists.
- Seed/demo data is clearly marked.
- UI can read from a canonical state source instead of hard-coded theater.

**Recommended v1 storage:**
- Start with local JSON/SQLite for inspectability.
- Do not introduce Convex/cloud dependency until the local loop proves useful.

---

### Goal 3 — Holographic command console

**Purpose:** Clicking the central command table opens the real Mission Control interface.

**Visual target:**
A translucent holographic overlay inspired by the attached reference image:
- dark sci-fi glass panels
- cyan/blue glow
- thin borders
- backdrop blur/transparency
- projected-from-table feel
- functional panels, not decorative HUD spam

**Panels:**
1. Mission Overview
2. Mission Map
3. Agent Status
4. Task Lanes
5. Review Chamber
6. Telemetry Wall
7. Signal Chamber
8. Deployment Hub
9. Facility Buildout / Asset Pipeline

**Done when:**
- Central console/table is clickable.
- Overlay opens/closes cleanly.
- Panels show canonical state.
- Empty/demo states are labeled honestly.

---

### Goal 4 — Agent roster + assignment logic

**Purpose:** Model agents as operational workers with skills, trust levels, load, and current goals.

**Initial roster:**
- Artemis — orchestrator / review / sequencing
- Forge or Builder — implementation / frontend / systems
- Sentinel — QA / safety / verification
- Prospector or Scout — research / signals / memory extraction
- Quartermaster — deploys / pipelines / event plumbing
- Navigator — roadmap / dependencies / goal alignment

**Assignment score:**
`skill match + trust + availability - load - risk mismatch`

**Done when:**
- Agents appear in the command console.
- Tasks/goals can be assigned.
- Agent state drives facility visualization.

---

### Goal 5 — AAA asteroid facility buildout

**Purpose:** Make the 3D asteroid facility a first-class build campaign, not post-hoc polish.

**North-star:**
A high-end sci-fi asteroid-base operations floor: cinematic, navigable, dense but readable, with a central holographic command table, specialized agent work zones, hangar/deep-space context, and real facility scale.

**Required pipeline:**
1. **Existing asset inventory**
   - Audit current `.blend`, `.glb`, reports, Meshy assets, and art-direction docs.
   - Identify reusable modules vs. discard candidates.

2. **GPT Image 2 concept iteration**
   - Generate/iterate concept frames for:
     - command hub / holo-table
     - asteroid cutaway shell
     - facility districts
     - hangar/deploy dock
     - review chamber
     - observatory/signal room
     - operator stations
   - Use outputs as art-direction references, not automatic truth.

3. **Meshy.ai 3D asset generation/refinement**
   - Convert approved concepts into modular assets.
   - Prioritize large architectural modules before small props.
   - Track source prompt, cost/credits, output files, cleanup status, and integration verdict.

4. **Blender cleanup + optimization**
   - Clean topology/materials where needed.
   - Export web-ready GLB assets.
   - Keep performance budgets visible.

5. **Three.js integration**
   - Replace primitive geometry with approved modular assets incrementally.
   - Preserve frame rate and readability.
   - Avoid neon clutter and tiny unreadable detail.

6. **Visual review gates**
   - Every facility macro-pass must include screenshot or documented blocker.
   - Score against `docs/target-design-spec.md` and north-star references.
   - Verdict must answer: closer or not closer?

**AAA quality criteria:**
- Facility reads at first glance as a large asteroid operations base.
- Interior owns 75-85% of the frame; asteroid shell acts as proscenium/context.
- Central holo-table is iconic and functional.
- Four major districts are legible from overview.
- Materials feel premium: graphite, black glass, brushed steel, dark rock, cyan hologram, amber practicals.
- Lighting is cinematic but readable.
- Agents/operators feel embedded in work zones.
- Performance remains web-viable.

**Stop rules:**
- Do not spend paid credits without approval.
- Do not claim external generation happened unless it did.
- Do not add assets that reduce the composition or frame rate.

---

### Goal 6 — Real-time event bridge

**Purpose:** Make the facility and console respond to actual system state.

**Done when:**
- Goal/task/agent events update the console.
- Facility animations reflect real statuses: idle, working, blocked, reviewing, deploying, completed.
- Activity feed is inspectable.

---

### Goal 7 — Quality/review gates

**Purpose:** Prevent autonomous slop and unsafe external actions.

**Gated actions:**
- deploys
- public posts
- credentials/config changes
- destructive file operations
- broad rewrites
- expensive external generation

**Done when:**
- Risky goals enter Review.
- Artemis/Michael approval is represented explicitly.
- Failed verification blocks completion.

---

### Goal 8 — v1 verification run

**Purpose:** Prove Mission Control works as an operating system.

**Acceptance test:**
1. Open the facility.
2. Click central console.
3. Create or select a goal.
4. Assign it to an agent/runtime.
5. Show task/agent/event movement.
6. Open review/telemetry/artifacts.
7. Complete the goal with proof.
8. Show facility state reflecting actual state.

**V1 is done when:**
Mission Control can run one real project goal end-to-end with transparent state, proof, and review.

## Immediate next Codex goal

Run **Goal 1 — Codex runtime policy + goal runner design**, then implement the minimum state model needed for Goal 2.
