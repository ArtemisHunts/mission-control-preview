# Visual Review — 2026-04-29 Concept C HIFI-15 deep viewport / back-facility reveal pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-15-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-15-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, HIFI-14 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting
Skill focus: HIFI-15 widen/deepen the viewport so the back of the facility is readable, matching the corrected reference depth.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael pointed to the reference depth: you can see all the way to the back facility, not just a dark foreground hole.
- web-game-foundations: solve this with cutaway proportion, occlusion reduction, and rear-depth macro layers, not polygon spam.
- three-webgl-game: widen the shell cutout, soften old foreground masks, add receding decks/corridor lines, and brighten rear hangar/depth planes.
- web-3d-asset-pipeline: preserve separable layers: front shell, mid decks, rear facility, rear hangar light, cheap scale lights.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: can we now see through the asteroid base to the rear facility/hangar like the corrected reference?
North-star verdict: pending.

