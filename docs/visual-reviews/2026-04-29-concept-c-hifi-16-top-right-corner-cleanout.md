# Visual Review — 2026-04-29 Concept C HIFI-16 top-right corner cleanout pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-16-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-16-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, HIFI-15 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | playtest-fix
Skill focus: HIFI-16 remove the entire top-right corner and clean the weird exterior/procedural texturing behind the entrance.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael identified the top-right corner as dead weight and the exterior entrance texture as an artifact.
- web-game-foundations: remove/occlude the bad quadrant cleanly without adding compute-heavy filler.
- three-webgl-game: cut the top-right quadrant out of the dense shell/rim mesh and overlay clean space/back-depth where old noisy layers showed through.
- web-3d-asset-pipeline: preserve shell/rim/facility separation and make the cleanup reversible/tweakable.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does removing the top-right corner open the facility/back read and eliminate the crunchy exterior texture artifact?
North-star verdict: pending.

