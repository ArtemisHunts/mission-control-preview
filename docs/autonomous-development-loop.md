# Mission Control — Autonomous Development Loop

_Last updated: 2026-04-26_

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

The target spec is not decorative. Every loop should map its work to one or more explicit sections of the spec.

---

## 2. Loop contract

Each autonomous loop must do one meaningful pass. Do not churn tiny cosmetic edits unless they support a larger fidelity goal.

Required loop sequence:

1. **Inspect current state**
   - `git status -sb`
   - latest commits
   - live GitHub Pages markers if relevant
   - current app.js / CSS structure

2. **Pick the largest gap**
   - Compare current site against `target-design-spec.md`.
   - Choose one high-impact area from the fidelity bar.
   - State the chosen gap before coding.

3. **Implement one coherent pass**
   - Examples:
     - architectural shell pass
     - central holo-table pass
     - room physicalization pass
     - operator/avatar pass
     - concept-to-3D asset pass
     - material/lighting pass
     - exterior vista/scale pass
   - Avoid random scattered tweaks.

4. **Smoke test locally**
   - `node --check app.js`
   - static server + `curl` markers when HTML/JS changed
   - no broken imports

5. **Commit cleanly**
   - clear commit message
   - no secrets
   - no Zoophoria credentials/remotes

6. **Push to ArtemisHunts only**
   - repo: `ArtemisHunts/mission-control-preview`
   - use ArtemisHunts credential only

7. **Verify or queue Pages deploy check**
   - if Pages is live, verify markers
   - if Pages is lagging, schedule a deploy verification check

8. **Post concise update**
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

1. **Vertical-slice container** — heavy asteroid borders, exposed cut planes, foreground sill/crown, rear cavern darkness.
2. **Lighting reset** — lower ambient wash; stronger rim, practical, hangar, and table sources with readable silhouettes.
3. **Environment-first framing** — keep UI out of the way.
4. **Architectural shell** — make the room believable from the outside-in.
5. **Facility scale/depth** — distant hangar/service layers, negative space, station separation.
6. **Holo-table hero object** — make the center visually iconic only after the container reads.
7. **Room physicalization** — replace pads with real workspaces.
8. **Material richness** — graphite, black glass, brushed steel, rock.
9. **Operators and life** — suited agents, drones, subtle motion.
10. **Asset pipeline** — move from primitives to GLB modules using `docs/concept-to-3d-asset-pipeline.md` after the container/lighting passes are strong.
11. **Embedded UI** — bring functionality back through in-world consoles.

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
