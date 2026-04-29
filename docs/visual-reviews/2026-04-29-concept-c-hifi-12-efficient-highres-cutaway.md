# Visual Review — 2026-04-29 Concept C HIFI-12 efficient high-res cutaway asset pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-12-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-12-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, HIFI-11 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition
Skill focus: HIFI-12 efficient high-resolution browser-native asset pass — replace portal optimization with a full asteroid cutaway shell built from dense, editable BufferGeometry.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael clarified both the correct reference and the asset quality bar. We need a full asteroid cutaway asset, not another decorative overlay.
- web-game-foundations: keep browser performance sane by using a few dense BufferGeometry systems, not thousands of independent primitive meshes.
- three-webgl-game: create a high-resolution front asteroid shell/cutaway mesh with useful vertices in silhouette/cut-rim/material-relief zones only.
- web-3d-asset-pipeline: structure the result as future GLB-style modules: asteroid body, cut rim, layered decks, central pit, rear hangar, scale-light scatter.
- game-ui-frontend: not-applicable — no interface work except cache/readout string.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side against corrected target, and honest gate.

North-star question: does the scene now read closer to the actual target — a complete asteroid body floating in space with an irregular carved-open industrial base?
North-star verdict: pending.

