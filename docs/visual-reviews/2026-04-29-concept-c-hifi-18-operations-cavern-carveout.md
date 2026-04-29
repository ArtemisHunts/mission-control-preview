# Visual Review — 2026-04-29 Concept C HIFI-18 operations cavern carveout pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-18-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-18-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, HIFI-17 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition
Skill focus: HIFI-18 carve out significantly more internal cavern volume for operations, with thinner asteroid walls and readable open operations floor.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael says the interior still needs to be carved out a lot more to make room for operations.
- web-game-foundations: change the generator and scene layering so it is genuinely more open, not just visually painted over.
- three-webgl-game: enlarge the shell cutout, reduce wall/rim thickness, suppress old interior blockers, and build a clear operations-volume layout.
- web-3d-asset-pipeline: keep the operations floor, rear decks, pit, hangar, and wall plates modular/tweakable.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does this finally create enough open cavern volume for a believable operations complex inside the asteroid?
North-star verdict: pending.

