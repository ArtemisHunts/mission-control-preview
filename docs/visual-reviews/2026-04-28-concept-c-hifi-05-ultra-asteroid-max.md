# Visual Review — 2026-04-28 Concept C HIFI-05 ultra asteroid max-density pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-28-concept-c-hifi-05-ultra-asteroid-max.png`
Additional screenshots:
- `docs/visual-reviews/2026-04-28-concept-c-hifi-05-ultra-asteroid-detail.png` — 2560x1440 zoom/detail proof
- `docs/visual-reviews/2026-04-28-concept-c-hifi-05-ultra-asteroid-ceiling.png` — 2560x1440 ceiling proof
References benchmarked: Michael critique in Discord, approved Concept C art direction, `docs/loops/concept-c-hifi-loop-prompt.md`, HIFI-04A/04B screenshots.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition | playtest-fix
Skill focus: maximum practical asteroid shell fidelity, taller ceiling/cavern volume, zoomable review camera states, and 4K screenshot proof.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: treat Michael's critique as direction, not polish feedback. The asteroid itself is the product surface right now.
- web-game-foundations: add camera/view controls so full-scale review and close inspection are both possible across viewport sizes.
- three-webgl-game: push denser custom rock surfaces, taller ceiling mass, macro strata, crater basins, fracture ribbons, chips, and asteroid-specific lighting.
- web-3d-asset-pipeline: keep the procedural shell modular so it can later be replaced with authored GLB asteroid sections.
- game-ui-frontend: applicable only for zoom/view controls requested by Michael; no unrelated HUD polish.
- game-playtest: validate module syntax, open via CDP, capture 3840x2160 full-frame proof plus zoom/ceiling proof.

## What changed
- Raised the default camera to a wider full-frame view and enabled OrbitControls zoom.
- Added visible camera controls: Full, Wide, Detail, Ceiling, plus +/- and keyboard shortcuts (`+`, `-`, `0`, `c`).
- Added `buildUltraHighResolutionAsteroidCeiling()`:
  - taller side walls and ceiling crown up to roughly y=10.4
  - high-density `buildHifiRockPanel()` panels at ~0.08–0.10 grid spacing
  - macro fracture/strata bands
  - macro impact basins with darker pits and raised rims
  - crater fields, hairline fracture branches, 72 raised chip/shard silhouettes
  - warm/cool asteroid-specific lights to expose ceiling relief
- Increased renderer pixel ratio cap from 1.2 to 1.5.
- Expanded starfield central clearing so the taller asteroid does not get polluted by background stars.

## Resolution note
Older 04A/04B screenshots shared in Discord were **1600x900** captures. HIFI-05 full-frame proof is **3840x2160**. Detail/Ceiling proof captures are **2560x1440**.

## Gate scores
Container/shell: 4/5 — much more vertical asteroid volume; ceiling mode makes the taller shell explicit.
Station visibility: 3/5 — not the focus of this pass, but facility remains readable enough inside the asteroid frame.
Lighting/readability: 4/5 — warm/cool grazing lights expose the rock; some high-density areas still become noisy.
Depth/scale: 4/5 — wide and ceiling views finally make the shell feel tall instead of squat.
Lighting/readability note: asteroid-specific lighting improved relief and screenshot readability, but the next pass should separate macro geology from micro-noise more cleanly.

- Asteroid ceiling taller: **4.25/5** — much more vertical volume; ceiling mode makes the taller shell explicit.
- Zoom/view controls: **4.5/5** — functional presets plus +/- and wheel zoom. UI is legible enough, though still intentionally compact.
- Asteroid mesh/detail density: **4.0/5** — materially denser and richer; still procedural and not authored-final.
- Geological hierarchy: **3.7/5** — better macro strata/basins/fractures, but some regions still read as noisy triangulation rather than sculpted stone.
- Material/value richness: **3.8/5** — improved warm/cool strata and occlusion; needs more authored mineral logic later.
- Performance/readiness: **3.8/5** — 4K screenshot captured successfully; browser remained stable in CDP.

Game Studio checklist:
- [x] Asteroid-only work respected except requested camera/view controls.
- [x] Full-frame 3840x2160 screenshot captured.
- [x] Zoom/detail and ceiling screenshots captured.
- [x] Syntax check passed.
- [ ] Gold-standard authored asteroid geology achieved.

North-star verdict: closer. This is the strongest asteroid foundation so far and satisfies the requested taller/zoomable/high-resolution pass, but it is still not gold-standard authored asteroid art.

Next visual fix:
- Reduce uniform triangulated noise and add more intentional large-scale geological forms: smoother worn planes, deeper impact scars, clearer crust/mid-layer/mined cut layers.
