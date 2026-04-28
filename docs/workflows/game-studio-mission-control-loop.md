# Game Studio Mission Control Workflow

_Last updated: 2026-04-27_

Mission Control now uses Michael-provided Game Studio skills as the operating layer for scene creation. The canonical skill source is outside this repo at:

- `../notes/game-studio/vendor/game-studio-markdown-handoff/`

The installed OpenClaw skill copies live at workspace level:

- `../skills/game-studio/`
- `../skills/web-game-foundations/`
- `../skills/three-webgl-game/`
- `../skills/web-3d-asset-pipeline/`
- `../skills/game-ui-frontend/`
- `../skills/game-playtest/`
- plus supporting Phaser/R3F/sprite skills for other projects.

Shared references live at:

- `../skills/_game-studio-references/`

## Primary north star

- `docs/moodboards/north-star-asteroid-operations-floor.png` is the primary visual target.
- Every scene pass should explicitly move toward its default-view qualities: circular sunken command hub, large blue holographic globe/table, encircling operator consoles, ceiling ribs/practical strips, asteroid/hangar window context, warm/cool cinematic lighting, and dense organized sci-fi material detail.

## Entry point

Start every Mission Control macro pass with `game-studio` routing, then immediately move to the specialist stack. For this project, the default route is:

```txt
game-studio
  -> web-game-foundations
  -> three-webgl-game
  -> web-3d-asset-pipeline
  -> game-ui-frontend, only when HUD/labels/DOM overlays change
  -> game-playtest
```

Why this route:

- Mission Control is a plain Three.js/WebGL environment with direct render-loop control.
- The work is increasingly a 3D environment/asset problem, not just primitive geometry placement.
- Visual proof is mandatory because subjective scene changes can look better in code and worse on screen.

## Required pre-pass classification

Before coding, write the route into the visual review draft or implementation notes:

```md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | UI | performance | playtest-fix
Skill focus: ...
```

Use these pass types:

- `composition`: camera, framing, shell, silhouette, depth, facility hierarchy.
- `lighting`: exposure, ambient/fill/key/rim, fog, readability, shadow crush.
- `asset-pipeline`: GLB/glTF modules, modular kits, proxies, compression/LOD readiness.
- `UI`: DOM HUD, labels, menus, overlays, interaction copy.
- `performance`: mesh count, loops, draw-call pressure, disposal, loaders, frame stability.
- `playtest-fix`: screenshot/readability/interaction issue found during QA.


## Active development protocol

Game Studio is not an end-of-pass label. Use it before and during implementation.

Every non-trivial Mission Control pass must produce a short **pre-code skill application note** before editing runtime files. This can live in the visual review draft, implementation notes, or the work log, but it must be written before code changes.

Required pre-code sequence:

1. **game-studio routing**
   - Classify the task and name the specialist route.
   - State why this is composition, lighting, asset-pipeline, UI, performance, or playtest-fix work.
2. **web-game-foundations application**
   - Name the state/render/input boundary touched.
   - Decide whether this is scene structure, camera behavior, interaction, or diagnostics.
3. **three-webgl-game application**
   - Define the camera/readability target.
   - Identify render graph/material/light/fog changes before writing them.
   - State the performance risk: mesh count, loops, draw-call pressure, or none.
4. **web-3d-asset-pipeline application**
   - Treat even primitive geometry as future asset blockout.
   - Name the modular kit being approximated: asteroid shell, bay wall, console island, holo-table, catwalk, operator, drone, etc.
   - State whether the pass is still primitive-blockout or moving toward GLB/glTF.
5. **game-ui-frontend application, if relevant**
   - State whether HUD/labels/menus/DOM overlays changed.
   - Keep UI low-chrome unless the task explicitly calls for UI work.
6. **game-playtest plan**
   - Define what screenshot/readability/camera/interaction check will prove the pass.
   - If screenshot capture is blocked, name the public deploy check or human browser check needed.

Required pre-code note format:

```md
Pre-code Game Studio application:
- game-studio: ...
- web-game-foundations: ...
- three-webgl-game: ...
- web-3d-asset-pipeline: ...
- game-ui-frontend: applicable | not-applicable — ...
- game-playtest: ...
```

During implementation, keep the route live. If the code starts drifting away from the pre-code note, stop and rewrite the note before continuing. That is the point: the skills shape the pass, not merely certify it afterward.

## Skill responsibilities

### game-studio

Use as the router only. It classifies the work and prevents stack drift.

Mission Control default:

- 3D + plain Three.js/Vite-style imperative app.
- Direct scene/camera/renderer/game-loop control.
- DOM UI for text-heavy HUD/labels.

### web-game-foundations

Use for core game/app boundaries:

- keep state/simulation separate from render objects
- define input/camera/debug boundaries
- keep the loop coherent instead of piling visual hacks into random functions

### three-webgl-game

Use for actual scene implementation:

- camera is explicit and intentional
- render graph is a view layer, not the data model
- lighting/material/fog choices are deliberate systems
- WebGL performance budget stays visible
- DOM overlays remain the default for UI-heavy elements

Current non-negotiables:

- every pass must improve or preserve readability
- no tiny decorative geometry if a large readable form solves the same problem
- avoid renderer migration to WebGPU unless it is its own planned technical pass

### web-3d-asset-pipeline

Use whenever work creates or changes 3D environment modules, even if they are still hand-blocked primitives.

Mission Control asset discipline:

- think in modular kits: wall panels, bay frames, cranes, rails, conveyors, drones, consoles, operator suits, rock chunks
- prefer GLB/glTF 2.0 for shipped assets when moving beyond primitives
- keep clean pivots, scale, low/mid poly budgets, limited material count
- validate silhouette in the actual camera before polishing
- asset work must serve scene readability, not just add detail

### game-ui-frontend

Use when touching:

- labels
- HUD/status blocks
- navigation hints
- menus
- DOM overlays
- text-heavy in-world UI

Rule: keep UI low-chrome. The environment owns the first read.

### game-playtest

Use at the end of every pass.

Required checks:

- screenshot captured, or blocker recorded plainly
- visual hierarchy: what reads first, second, third?
- lighting/readability: any black-crush or unreadable subject?
- camera: does the intended subject sit in frame?
- interaction: no broken navigation/click handling
- performance budget: app size, mesh constructor count, loop markers

## Mission Control definition of done for each pass

A pass is not done until it has:

1. A coherent visual thesis.
2. A pre-code Game Studio application note.
3. A declared Game Studio route.
4. A declared pass type and skill focus.
5. Source checks:
   - `node --check --input-type=module < app.js`
   - `git diff --check`
6. Macro gate:
   - `node scripts/macro-gate.mjs --min-source-lines=120 --max-app-lines=2600 --max-mesh-constructors=70 --max-loop-markers=75`
7. A visual review with:
   - screenshot path or explicit blocker
   - references benchmarked, including `docs/moodboards/north-star-asteroid-operations-floor.png`
   - Game Studio route
   - asset pipeline stance
   - lighting/readability note
   - next visual fix
8. Clean commit and push to `ArtemisHunts/mission-control-preview`.

## Current recommended route for the next scene pass

```txt
game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
```

Recommended thesis:

```txt
lighting readability lock + production bay silhouette
```

Why:

- Michael reported the public scene is incredibly dark.
- We have been making composition changes blind because screenshot capture has been unreliable.
- The next meaningful improvement is not more machinery; it is making the facility readable.

Expected focus:

- exposure and fill lift
- broad industrial work lights
- rim/backplate separation
- fog/black-crush correction
- preserve asteroid border as frame, not subject
- document screenshot status honestly
