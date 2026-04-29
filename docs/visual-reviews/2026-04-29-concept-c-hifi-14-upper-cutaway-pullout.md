# Visual Review — 2026-04-29 Concept C HIFI-14 upper cutaway pullout pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-14-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-14-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, HIFI-13 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline
Skill focus: HIFI-14 pull more mass out of the upper section so the facility and rear hangar are more visible while preserving chunky asteroid rim.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael correctly called out the upper section still chokes the facility reveal.
- web-game-foundations: open the view with targeted compositional cutout and macro facility visibility, not random extra geometry.
- three-webgl-game: mask/carve the top-center shell read, rebuild the upper rim as chunky broken rock, and reveal upper/rear deck layers.
- web-3d-asset-pipeline: preserve separable modules: upper void, broken rim, upper decks, hangar, crane silhouettes, lights.
- game-ui-frontend: not-applicable — only cache/readout text.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does removing more upper mass make the facility read clearly while keeping the asteroid body believable?
North-star verdict: pending.

