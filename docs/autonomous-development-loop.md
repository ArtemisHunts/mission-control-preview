# Mission Control — Autonomous Development Loop

_Last updated: 2026-04-27_

This document defines how Artemis should use `docs/target-design-spec.md` during recurring development loops to move Mission Control from low-fidelity prototype to high-quality 3D environment.

## 1. Source of truth

Primary design target:

- `docs/target-design-spec.md`

Primary visual references:

- `docs/moodboards/world-architecture.png`
- `docs/moodboards/materials-avatars.png`
- `docs/moodboards/holographic-ui.png`
- `docs/moodboards/mission-control-design-boards-combined.jpg`

Asset pipeline reference:

- `docs/concept-to-3d-asset-pipeline.md`

Game Studio workflow reference:

- `docs/workflows/game-studio-mission-control-loop.md`

Installed Game Studio skill route for this project:

- `game-studio` → `web-game-foundations` → `three-webgl-game` → `web-3d-asset-pipeline` → `game-playtest`
- Add `game-ui-frontend` whenever labels, HUD, menus, DOM overlays, or text-heavy in-world UI change.

The target spec is not decorative. Every loop should map its work to one or more explicit sections of the spec.

---

## 2. Loop contract

Each autonomous loop should now be a **macro pass**, not a tiny tweak. Progress was too slow when every run changed one small detail. A good loop should move one whole visual pillar enough that Michael can see the difference immediately.

Default budget:

- **30 minutes per focused macro pass** by default.
- **1–3 coordinated changes** are allowed when they support one visual outcome.
- One commit is still preferred, but the commit may span camera, lighting, shell, and depth only when they are tightly part of the same composition goal.

Macro-pass examples:

- **Untrap + reveal pass:** camera, FOV, station visibility, fog, base fill lighting.
- **Container read pass:** asteroid border silhouette, cross-section mass, cut planes, rear darkness, scale markers.
- **Lighting rebuild pass:** ambient balance, key/rim/practical lights, emissive tuning, fog/readability.
- **Facility depth pass:** background decks, service shafts, hangar layers, distant silhouettes, station separation.

Still avoid random grab-bag edits. The unit of work is bigger, but it must have one clear visual thesis.

Required loop sequence:

1. **Inspect current state**
   - `git status -sb`
   - latest commits
   - live GitHub Pages markers if relevant
   - current app.js / CSS structure

2. **Actively apply Game Studio before coding**
   - Start with `game-studio` classification.
   - Default route: `web-game-foundations` → `three-webgl-game` → `web-3d-asset-pipeline` → `game-playtest`.
   - Add `game-ui-frontend` when UI/HUD/labels change.
   - Declare pass type before coding: `composition`, `lighting`, `asset-pipeline`, `UI`, `performance`, or `playtest-fix`.
   - Write a pre-code Game Studio application note before editing runtime files.
   - Use the note to define camera/readability target, render/material/fog changes, modular asset stance, UI stance, and playtest proof.
   - If implementation drifts, stop and revise the note before continuing.

3. **Pick the largest gap**
   - Compare current site against `target-design-spec.md`.
   - Choose one high-impact area from the fidelity bar.
   - State the chosen gap before coding.

4. **Implement one coherent macro pass**
   - Examples:
     - wide camera + station reveal pass
     - asteroid container + cut-plane pass
     - lighting + fog readability pass
     - facility depth + station separation pass
     - architectural shell pass
     - central holo-table pass
     - room physicalization pass
     - concept-to-3D asset pass, only after container/framing/lighting are strong
   - 2–4 coordinated edits are allowed if they serve the same visual thesis.
   - Avoid random scattered tweaks.

5. **Smoke test locally**
   - `node --check --input-type=module < app.js`
   - `git diff --check`
   - static server + `curl` markers when HTML/JS changed
   - no broken imports

6. **Run Game Studio playtest gate**
   - Capture screenshot when tooling allows, or record the blocker plainly.
   - Check visual hierarchy, lighting/readability, camera subject, interaction, and performance budget.
   - Update visual review fields required by `scripts/macro-gate.mjs`.

7. **Commit cleanly**
   - clear commit message
   - no secrets
   - no Zoophoria credentials/remotes

8. **Push to ArtemisHunts only**
   - repo: `ArtemisHunts/mission-control-preview`
   - use ArtemisHunts credential only

9. **Verify or queue Pages deploy check**
   - if Pages is live, verify markers
   - if Pages is lagging, schedule a deploy verification check

10. **Post concise update**
   - commit hash
   - commit message
   - what changed
   - smoke test status
   - GitHub Pages status

---

## 3. Fidelity scorecard

At the start or end of each major pass, score the current site honestly from 0–5.

| Category | 0 | 3 | 5 |
|---|---|---|---|
| Environment ownership | website/HUD dominates | scene is visible but UI competes | full-screen environment owns experience |
| Architectural shell | flat floor/walls | some ribs/windows/rock | believable asteroid-base room with depth |
| Holo-table spectacle | small/simple prop | recognizable table | hero object with premium hologram/lighting |
| Room physicalization | colored pads | primitive props | believable specialized workspaces |
| Materials | flat colors | basic metal/glass/rock hints | rich graphite/steel/glass/rock contrast |
| Lighting | even/toy-like | some contrast | cinematic, layered, readable silhouettes |
| Operators | markers/bobbleheads | basic suited figures | believable operators with role identity |
| Scale/detail | sparse | props added | dense enough to feel lived-in and large |
| Interaction/camera | static/orbit only | room nav works | composed cinematic room navigation |
| Performance/readiness | broken/heavy | works locally | deployable, responsive, controlled budgets |

Target before calling it “high quality”: mostly 4s, no category below 3.

Target before calling it “moodboard-close”: mostly 5s, no category below 4.

---

## 4. Current priority ladder

Current Michael directive: **work outside-in before more interior detail.** The container is the product read: asteroid borders, vertical-slice cross-section, cavern depth, and lighting must sell “looking into a production base carved into rock.” Interior props/assets are paused unless they directly support that container read.

Work should generally climb this ladder unless a blocker appears:

1. **Wide cutaway camera** — pull far enough back that the full vertical-slice asteroid container and all station districts read before interior detail; avoid trapping the user inside the room.
2. **Vertical-slice container** — heavy asteroid borders, exposed cut planes, foreground sill/crown, rear cavern darkness.
3. **Lighting reset** — exposure/readability first; broad fill, stronger key/rim/practical work lights, fog control, and readable silhouettes. Do not confuse darkness with premium mood.
4. **Environment-first framing** — keep UI out of the way.
5. **Architectural shell** — make the room believable from the outside-in.
6. **Facility scale/depth** — distant hangar/service layers, negative space, station separation.
7. **Holo-table hero object** — make the center visually iconic only after the container reads.
8. **Room physicalization** — replace pads with real workspaces.
9. **Material richness** — graphite, black glass, brushed steel, rock.
10. **Operators and life** — suited agents, drones, subtle motion.
11. **Asset pipeline** — move from primitives to GLB/glTF modules using `docs/concept-to-3d-asset-pipeline.md` and the `web-3d-asset-pipeline` skill after the container/lighting passes are strong.
12. **Embedded UI** — bring functionality back through in-world consoles.

---

## 5. What to avoid

- Do not add large website panels/marketing hero back into the scene.
- Do not mistake more neon for more fidelity.
- Do not keep adding colored primitive boxes without improving material/shape language.
- Do not work on menus before the environment reads correctly.
- Do not push vague “polish” commits; every commit should map to a target spec gap.
- Do not touch Zoophoria for this project.

---

## 6. When to request human input

Ask Michael only when the decision materially affects direction:

- choosing between major art styles
- approving a new asset pipeline/tooling dependency
- switching deploy platform
- using paid asset packs
- introducing generated/contracted art
- changing the core room metaphor

Do not ask for permission for normal implementation loops.

---

## 7. Escalation plan for quality

If primitive Three.js geometry stops producing meaningful fidelity gains, move to the concept-to-3D asset pipeline in `docs/concept-to-3d-asset-pipeline.md`:

1. Define modular GLB asset list.
2. Generate or source blockout GLBs.
3. Install/use Blender headless if available.
4. Replace primitives with modular room shells, consoles, chairs, props, and operators.
5. Keep procedural animation and interaction in Three.js.

Likely GLB modules:

- command-table kit
- wall/rib/window modules
- floor panel kit
- console kit
- chair kit
- cargo/crate kit
- operator suit kit
- drone kit
- cable/conduit kit
- rock/asteroid kit

---

## 8. Concept-to-3D operating rule

Generated 3D assets are now part of the art process, but only under discipline:

- Use concept-to-3D for contained assets: drones, operators, consoles, chairs, cargo, tools, ship silhouettes, bay dressing.
- Do **not** use it to replace the main asteroid-base composition work. The facility still needs hand-directed camera, scale, silhouette, negative space, traversal, and depth.
- Test generated assets in the live Three.js scene immediately. If they do not read in the actual camera, fix silhouette/scale/materials before polishing.
- Prefer low-poly/mid-poly GLB assets with clean pivots, few materials, and baked/painted detail.
- Every loop should explicitly choose: composition pass or asset pipeline pass. Do not blur both into a messy mega-pass.

Recommended first proof asset: **remote bay maintenance drone**.

---

## 9. Definition of done for the current phase

The current phase is done when:

- the app feels environment-first immediately on load
- central holo-table is the obvious visual anchor
- each workspace is visually distinct and believable
- agents visibly belong to workspaces
- material/lighting reads premium sci-fi, not toy neon
- screenshot can sit beside moodboards 1 and 3 without looking like a wireframe
- GitHub Pages deploy is stable

Until then, keep looping.
