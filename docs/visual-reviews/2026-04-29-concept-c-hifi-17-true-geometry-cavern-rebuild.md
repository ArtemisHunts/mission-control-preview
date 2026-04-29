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
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael asked directly whether this was real geometry or blockout. This pass must materially change generated geometry and reduce fake overlays.
- web-game-foundations: solve the visual bug at the mesh-generator level first, then use a small number of dense editable rock plate modules.
- three-webgl-game: widen/heighten the procedural shell cutout, thin the rim wall, remove the upper-right quadrant from shell/rim triangles, and suppress legacy artifact masks.
- web-3d-asset-pipeline: rebuild rock language as separable high-fidelity plate modules instead of fuzzy procedural texture noise.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does this now feel like an actual open, thin-walled asteroid cavern with enough room for the facility — not a blockout bandage?
North-star verdict: partial improvement; this is more real geometry and the mouth is larger, but the asteroid texture/silhouette still reads too noisy and fragmented.


## What changed
- Changed the actual HIFI-12 generator, not just overlays:
  - widened horizontal cutout radius
  - increased vertical cutout height
  - reduced radial bands from 14 to 12 for thinner walls
  - reduced rim depth from ~4.0 to ~2.35
  - removed a larger upper-right quadrant directly from generated shell/rim triangles
- Added `buildHifi17TrueGeometryCavernRebuildPass()`.
- Suppressed several legacy bandage/void/oval artifact layers.
- Added dense broad asteroid plate modules with lower micro-noise to replace some fuzzy exterior read.
- Added expanded cavern volume, wider macro decks, rear hangar light, and depth lighting.
- Updated cache bust/readout and deployed Pages to `40e249f`.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-17-true-geometry-cavern-rebuild-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-17-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-17-side-by-side.png`

## Gate scores
Concept match: 3.1/5 — larger opening and real geometry direction improved, but still far from target.
Upper-right removal / sunk back: 3.2/5 — less dominant and actually cut from generated mesh, but still fragmented rather than naturally carved.
Wider/taller mouth: 3.3/5 — improved.
Cavernous interior: 2.8/5 — still too flat/stage-like; needs deeper architectural layers.
Thin asteroid walls: 3/5 — thinner, but sliced-panel feeling remains.
Asteroid texture fidelity: 2.4/5 — still the weak point; noisy/fuzzy/pink speckling remains, not believable asteroid rock.
Performance/readiness: 3.1/5 — Pages loads, screenshot captured.

Overall visual gate: 3.05/5 / C-

## Honest read
This pass answers Michael's geometry question: yes, the generator now changes the actual mesh. It widened/heightened the mouth and cut out the top-right quadrant in triangles. But visually we are not past C-. The asteroid material language is still too fuzzy/procedural, and the scene still lacks the unified, carved, high-detail rock mass of the reference.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Runtime generator geometry changed, not only overlay blockout.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Stop adding more cutouts. Replace the fuzzy exterior material with darker sharper asteroid rock: larger fractured plates, harder grey/basalt values, fewer pink speckles, and a more unified lumpy silhouette around the now-open mouth.
