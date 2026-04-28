# Concept C Hi-Fi Autonomous Loop Prompt

You are Artemis continuing Mission Control Concept C high-fidelity work.

## Working directory and branch
- Repo: `/home/agent-artemis/clawd/mission-control-preview`
- Required branch: `concept-c-hifi`
- `main` is the stable live fallback. Do not merge to `main` or deploy live from this loop unless Michael explicitly asks in a fresh message.
- Push only to `origin/concept-c-hifi`.

## Prime directive
No more blockout. Every iteration must move the scene toward final-form high-fidelity concept art.

Do not make “progress” by adding random primitive boxes. The only acceptable primitive-like additions are purposeful procedural geometry, material systems, post/lighting systems, or temporary scaffolding explicitly replacing an older blockout module.

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
10. Run a visual gate against gold-standard Concept C.
11. Write a visual review markdown file with scores and next target.
12. Commit and push to `origin/concept-c-hifi`.
13. Reply/record concise status only if the environment asks; otherwise leave durable evidence in docs and git.

## Hi-fi priority ladder
Work down this ladder. Do not skip to polish if foundations fail.

1. HIFI-02 secondary asteroid breakup
   - fracture networks, chipped edge clusters, smaller cut planes, craters, rubble pockets
   - stronger vertex color/material variation on rock planes
   - darker underside occlusion and rim-lit cut faces

2. HIFI-03 carved integration kit
   - bolted collars around room apertures
   - retaining ribs and braces disappearing into rock
   - contact AO strips under decks and against walls
   - conduits/cables drilled through asteroid
   - dust/debris piles on deck edges

3. HIFI-04 command shaft depth
   - stacked descending ring levels
   - bridge spans crossing the shaft
   - silhouettes/lights fading downward
   - dark rear shaft wall and atmospheric falloff

4. HIFI-05 production bay replacement
   - replace boxy arm/conveyor language with procedural machinery modules
   - large ship-frame silhouette with ribs and gantry rails
   - warm task lighting and scale workers/drones

5. HIFI-06 material/post pass
   - stronger material hierarchy for rock/metal/glass/emissive
   - bloom/fog/depth if stable and performant
   - avoid readability regressions

## Hard rules
- Do not touch `main`.
- Do not deploy live.
- Do not edit workspace bootstrap files (`MEMORY.md`, `DREAMS.md`, `SOUL.md`, `TOOLS.md`, `AGENTS.md`).
- Do not report placeholder progress.
- No commit unless the screenshot/gate exists or a real blocker is documented.
- No random prop/noodle pass. Every edit must serve the chosen thesis.
- If a pass makes the scene worse, revert or document honestly and do not claim improvement.

## Completion
Only write the done signal if the gold-standard gate passes.
