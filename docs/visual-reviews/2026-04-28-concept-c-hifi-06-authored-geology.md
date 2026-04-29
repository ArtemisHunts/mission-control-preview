# Visual Review — 2026-04-28 Concept C HIFI-06 authored macro geology pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-28-concept-c-hifi-06-authored-geology-max.png`
Additional screenshots:
- `docs/visual-reviews/2026-04-28-concept-c-hifi-06-authored-geology-detail.png` — 2560x1440 detail proof
- `docs/visual-reviews/2026-04-28-concept-c-hifi-06-authored-geology-ceiling.png` — 2560x1440 ceiling proof
References benchmarked: Michael critique in Discord that HIFI-05 was closer but still could be much better, HIFI-05 proof set, `docs/loops/concept-c-hifi-loop-prompt.md`.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition | playtest-fix
Skill focus: move from density/noise to authored asteroid geology: macro planes, readable strata, ravines, impact basins, and chunkier rock forms.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael's challenge is correct; HIFI-05 increased density but did not fully solve asteroid believability.
- web-game-foundations: preserve the working zoom/camera proof while improving the scene's actual art direction.
- three-webgl-game: add smoother sculpted rock planes and larger geological features on top of the dense shell instead of only adding more micro-triangles.
- web-3d-asset-pipeline: keep each macro geological layer modular for later replacement by authored GLB shell chunks.
- game-ui-frontend: not-applicable except existing camera controls.
- game-playtest: syntax-check and capture 4K full-frame proof plus zoom/ceiling proof.

## What changed
- Added `buildSculptedRockPlane()` for smoother, lower-noise geological surfaces.
- Added `buildHifi06AuthoredAsteroidGeology()`:
  - broad worn ceiling planes
  - central sediment roof plate
  - left/right shear-wall faces
  - lower exposed crust shelf
  - rear cold cavern separation plane
  - dark ravine/canyon shapes for readable negative space
  - thick sediment strata bands
  - selective mineral veins
  - asymmetric impact depressions and raised rims
  - chunkier rock nodules instead of only flat shard noise
  - warm/cool macro lights separating readable geology from background density
- Updated cache-bust string and readout copy.

## Gate scores
Container/shell: 4/5 — the shell now has stronger authored macro forms rather than only high-frequency noise.
Station visibility: 3/5 — facility remains readable enough but is intentionally secondary while asteroid quality is the focus.
Lighting/readability: 4/5 — macro warm/cool lights help separate strata/ravines; still needs more sculptural authored material work.
Depth/scale: 4/5 — tall ceiling/cavern scale holds from HIFI-05 and the macro ravines improve depth cues.
Lighting/readability note: better than HIFI-05 because the geology hierarchy is clearer, but the browser-procedural look is still visible.

Asteroid believability: 4/5 — improved from dense noise toward intentional geology, not final authored asteroid art.
Macro geology hierarchy: 4/5 — large planes, strata, ravines, and basins are now visible.
Micro detail restraint: 3.5/5 — improved, but some older dense background detail still fights the broader sculpted forms.
Performance/readiness: 3.8/5 — CDP captured 3840x2160 and 2560x1440 proofs successfully.

Game Studio checklist:
- [x] Asteroid-only direction respected.
- [x] Improved macro geology over noisy triangulation.
- [x] Full-frame 3840x2160 screenshot captured.
- [x] Detail and ceiling proof screenshots captured.
- [x] Syntax check passed.
- [ ] Fully authored gold-standard asteroid achieved.

North-star verdict: closer. This is better than HIFI-05 because it moves up the detail hierarchy: big rock forms first, strata/impact/ravine systems second, micro chips last. It still needs a true authored-material pass or GLB-quality sculpt to hit gold.

Next visual fix:
- Start reducing/removing older noisy shell layers behind the macro geology and replace them with cleaner authored crust/mantle/cut-layer systems.
