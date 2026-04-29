# Visual Review — 2026-04-29 Concept C HIFI-17 true geometry cavern rebuild pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-17-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-17-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, HIFI-16 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition | playtest-fix
Skill focus: HIFI-17 actual geometry rebuild — wider/taller mouth, thinner asteroid walls, top-right quadrant removed from generated mesh, cleaner high-fidelity asteroid plates, more cavernous facility volume.
Asset pipeline stance: modular-GLB-planned
Playtest status: pending

Pre-code Game Studio application:
- game-studio: Michael asked directly whether this was real geometry or blockout. This pass must materially change generated geometry and reduce fake overlays.
- web-game-foundations: solve the visual bug at the mesh-generator level first, then use a small number of dense editable rock plate modules.
- three-webgl-game: widen/heighten the procedural shell cutout, thin the rim wall, remove the upper-right quadrant from shell/rim triangles, and suppress legacy artifact masks.
- web-3d-asset-pipeline: rebuild rock language as separable high-fidelity plate modules instead of fuzzy procedural texture noise.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does this now feel like an actual open, thin-walled asteroid cavern with enough room for the facility — not a blockout bandage?
North-star verdict: pending.

