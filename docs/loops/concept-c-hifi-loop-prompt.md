# Concept C Hi-Fi Autonomous Loop Prompt

You are Artemis continuing Mission Control Concept C high-fidelity work.

## Working directory and branch
- Repo: `/home/agent-artemis/clawd/mission-control-preview`
- Required branch: `concept-c-hifi`
- `main` is the stable live fallback. Do not merge to `main` or deploy live from this loop unless Michael explicitly asks in a fresh message.
- Push only to `origin/concept-c-hifi`.

## Prime directive
No more blockout. Every iteration must move the scene toward final-form high-fidelity concept art.

Do not make “progress” by adding random primitive boxes or low-poly slab clusters. The only acceptable primitive-like additions are purposeful carriers for higher-density procedural geometry, material systems, post/lighting systems, or temporary scaffolding explicitly replacing an older blockout module.

## Current status
- Stable live baseline is `main` at `4182445 Ship gate Concept C final silhouette pass`.
- Hi-fi branch started at `1b92f0a Start Concept C hifi geometry pipeline`.
- HIFI-01 added browser-native procedural geometry because Blender is not installed in the workspace:
  - `hifiNoise()`
  - `hifiColor()`
  - `hifiPrism()` using custom `BufferGeometry` + vertex colors
  - `buildHifiAsteroidShell()`
  - `buildHifiCommandShaft()`
- HIFI-01 gate verdict: direction approved / fidelity not approved. Overall ~2.9/5.


## New poly-density mandate — added after Michael critique
Michael called out that the current hi-fi work is still very low poly count. He is right. From now on, the loop must stop accepting broad faceted procedural chunks as “hi-fi.”

Every new visual pass must materially increase actual geometric richness or material-depth richness. Prefer:
- subdivided/displaced custom `BufferGeometry` surfaces with many vertices, not 8–16 point prisms
- layered fracture networks with small/medium/large crack hierarchy
- bevel/rim geometry around cut faces and apertures
- dense shaft rings, cables, bridge spans, braces, collars, and gantries with real segment counts
- surface detail systems: vertex-color noise, dust/debris clusters, mineral veins, normal-like plane variation
- if a primitive is used, it must be a temporary carrier for a higher-fidelity system, not the final visible form

A pass that only rearranges low-poly slabs, boxes, or cylinders should be treated as a failure, even if composition improves.

## Gold-standard target
High-fidelity Concept C asteroid cutaway:
- massive asymmetric asteroid body first
- real carved facility integration, not a room framed by rocks
- deep vertical command shaft, not a shallow table
- hero production bay integrated into excavated rock
- open star corners preserved
- cinematic material richness: faceted rock, chipped rims, worn metal, emissive tech, grime/contact occlusion, fog/depth

Gold-standard gate:
- visual gate average >= 4.5/5
- no category below 4.0/5 across concept match, asteroid shell fidelity, material richness, carved integration, command shaft depth, production/facility fidelity, lighting/depth, performance/readiness
- if this is achieved, write `HIFI_GOLD_STANDARD` to the done file specified by the Ralph runner.

## Required sequence every iteration
1. `cd /home/agent-artemis/clawd/mission-control-preview`
2. Verify branch and state:
   - `git branch --show-current`
   - `git status --short`
   - `git log --oneline -3`
3. If branch is not `concept-c-hifi`, stop and report the blocker. Do not work on `main`.
4. Read the current hifi docs/reviews:
   - `docs/concept-c-hifi-pipeline.md`
   - latest `docs/visual-reviews/*hifi*.md`
5. Pick exactly one coherent hi-fi thesis from the priority ladder below.
6. Write a pre-code Game Studio application note into the visual review draft before editing runtime files.
7. Implement the pass.
8. Smoke test:
   - `node --check --input-type=module < app.js`
   - `git diff --check`
9. Capture a screenshot using local server/CDP/browser tooling when available.
   - Prefer the direct CDP screenshot pattern used by prior successful manual passes.
   - Do **not** rely on Canvas tooling as the only path; if Canvas/browser policy fails, fall back to direct CDP or record a screenshot blocker.
   - A screenshot-tool failure is not a full loop failure if code checks pass, a real blocker is documented, and the commit is useful.
10. Run a visual gate against gold-standard Concept C when a screenshot exists. If no screenshot exists, write a provisional review and make screenshot recovery the next task.
11. Write a visual review markdown file with scores and next target.
12. Commit and push to `origin/concept-c-hifi`.
13. Reply/record concise status only if the environment asks; otherwise leave durable evidence in docs and git.

## Hi-fi priority ladder
Work down this ladder. Do not skip to polish if foundations fail.

1. HIFI-04A poly-density foundation pass
   - replace the low-poly asteroid mantle approach with subdivided/displaced custom BufferGeometry
   - increase vertex count and face density enough to remove the broad folded-paper read
   - add real multi-scale fracture geometry, not just accent strips
   - create a reusable high-density rock surface/detail generator

2. HIFI-04B command shaft high-poly depth pass
   - stacked descending ring levels with real segment counts
   - cables, bridge spans, lower silhouettes, lift rails, and small lights fading downward
   - darker rear shaft wall and atmospheric falloff

3. HIFI-05 carved integration kit
   - bolted collars around room apertures
   - retaining ribs and braces disappearing into rock
   - contact AO strips under decks and against walls
   - conduits/cables drilled through asteroid
   - dust/debris piles on deck edges

4. HIFI-06 production bay replacement
   - replace boxy arm/conveyor language with procedural machinery modules
   - large ship-frame silhouette with ribs and gantry rails
   - warm task lighting and scale workers/drones

5. HIFI-07 material/post pass
   - stronger material hierarchy for rock/metal/glass/emissive
   - bloom/fog/depth if stable and performant
   - avoid readability regressions

## Hard rules
- Do not touch `main`.
- Do not deploy live.
- Do not edit workspace bootstrap files (`MEMORY.md`, `DREAMS.md`, `SOUL.md`, `TOOLS.md`, `AGENTS.md`).
- Do not report placeholder progress.
- No commit unless the screenshot/gate exists or a real blocker is documented.
- Do not throw/exit the whole job as failed solely because Canvas/browser screenshot capture failed after useful code/checks/commit work. Document it as a blocker and keep the loop moving.
- No random prop/noodle pass. Every edit must serve the chosen thesis.
- If a pass makes the scene worse, revert or document honestly and do not claim improvement.

## Completion
Only write the done signal if the gold-standard gate passes.
