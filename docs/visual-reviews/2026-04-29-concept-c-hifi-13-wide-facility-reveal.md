# Visual Review — 2026-04-29 Concept C HIFI-13 wide facility reveal pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-13-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-13-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, HIFI-12 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline
Skill focus: HIFI-13 widen the carved asteroid opening and expose more readable facility without losing asteroid mass.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael likes the HIFI-12 direction but wants the opening wider so the facility becomes the hero.
- web-game-foundations: widen by changing cutaway proportions and visibility layers, not by brute-force adding random geometry.
- three-webgl-game: enlarge the efficient shell cutout, reduce old shadow occlusion, and add readable macro decks/pit/hangar shapes.
- web-3d-asset-pipeline: preserve modular asset separation: shell/rim, facility decks, pit, hangar, cranes, lights.
- game-ui-frontend: not-applicable — only cache/readout text.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does the wider opening show enough facility to resemble the corrected asteroid-base cutaway reference while still feeling like a solid asteroid shell?
North-star verdict: pending.

