# Visual Review — 2026-04-28 Concept C HIFI-06 macro-geology asteroid pass

Commit under review: pending commit at review time
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-28-concept-c-hifi-06-macro-geology-pass.png`
Additional screenshot:
- `docs/visual-reviews/2026-04-28-concept-c-hifi-06-macro-geology-detail.png` — 2560x1440 detail proof
References benchmarked: Michael critique in Discord, approved Concept C art direction, `docs/loops/concept-c-hifi-loop-prompt.md`, HIFI-04A/HIFI-04B/HIFI-05 screenshots, north-star asteroid moodboard.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | geology | lighting
Skill focus: macro geology over noisy triangulation, denser asteroid-only rock deformation, fracture hierarchy, thicker carved rims/strata, calmer material breakup, asteroid-specific lighting.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: take Michael literally. The asteroid itself is the product surface, so this pass only counts if the rock reads more sculpted and expensive from far view and zoom view.
- web-game-foundations: keep the approved framing and zoom controls stable; spend no effort on new interior readability tricks.
- three-webgl-game: replace blanket triangulated chatter with denser macro-ledges, crater basins, carved rim thickness, and controlled relief hierarchy inside the asteroid shell systems.
- web-3d-asset-pipeline: keep the new geology logic modular so later authored GLB shell sections can inherit the same massing/material logic instead of fighting it.
- game-ui-frontend: not applicable beyond preserving Michael’s requested zoom/view controls.
- game-playtest: run syntax/diff checks, capture fresh local screenshots through direct CDP, then score the asteroid honestly against the gold gate.

North-star question: does the asteroid read more like one massive carved body with intentional macro geology and material bands, and less like a uniformly noisy procedural wrapper?
North-star verdict: closer, but still not gold-standard asteroid art

## What changed
- Added asteroid-only geology shaping helpers to `app.js`:
  - `smoothstep()`
  - `ellipseMask()`
  - `capsuleMaskSample()`
  - `sampleAsteroidMacroGeology()`
  - `applyAsteroidValueZones()`
- Upgraded `buildHifiRockPanel()` so asteroid shell panels can carry real geology directives instead of uniform grid-noise only:
  - macro mass/basin/band/fault deformation
  - value-zone control for dust, warm exposed cuts, cool recesses, and shadow pockets
  - front-surface XY warping to break the obvious tiled triangulation read
  - deeper sidewall propagation of geology into cut thickness instead of flat extruded depth
- Added `buildAsteroidMacroGeologyPass()` as a dedicated asteroid-only overlay pass:
  - four broad geology ledges / sediment benches / compression buttresses
  - broad fracture shelves instead of only decorative micro cracks
  - extra warm/cool asteroid graze lights tuned for shell relief
- Preserved the existing zoom controls and left command shaft, production bay, collars, conduits, props, and other interior systems untouched.

## Screenshot / gate notes
- Local static server served the current branch at `http://127.0.0.1:4173/`.
- Fresh screenshots were captured through direct CDP against the host browser on port `18800`, writing durable PNGs into `docs/visual-reviews/`.
- Smoke checks passed before capture:
  - `node --check --input-type=module < app.js`
  - `git diff --check`

## Gate scores
Asteroid shell fidelity: **3.3/5** — cleaner macro reads and less blanket noise than HIFI-05, but still visibly procedural and faceted in detail view.
Geological hierarchy: **3.8/5** — broad ledges, crater basins, cut benches, and rubble separation are materially clearer now.
Material/value richness: **3.4/5** — better warm/cool/dust/shadow zoning, though the shell still needs richer mineral logic and less same-family lavender/tan stone.
Carved integration: **3.7/5** — the cutaway reads more excavated and layered, with thicker shell language around the cavity.
Lighting/depth: **3.5/5** — asteroid-only graze lights help the shell read, but crevice occlusion and deep recess contrast still need work.
Performance/readiness: **3.8/5** — syntax clean, diff clean, local 4K and detail screenshots captured through CDP, browser stayed stable.

Overall asteroid-only gate: **3.6/5**

## What moved closer
- The asteroid now has more readable macro geology instead of one continuous triangulated chatter field.
- Broad ledges and sediment-bench reads give the top shell and lower sill more intentional structure.
- The cavity edge feels thicker and more carved, especially where macro overlays meet the roof and sill.
- Value zoning is less flat: exposed warm planes, dusty shelves, darker basin pockets, and cooler recesses separate better.
- Direct 3840x2160 proof exists for this pass rather than a placeholder claim.

## What is still off
- Some top-shell surfaces still read too procedural/tiled when viewed close.
- Transition zones between smoother planes and noisy rubble are still too abrupt.
- A few crater/basin shapes still feel placed rather than naturally broken.
- The asteroid still needs a stronger authored regolith/mineral story and heavier shadow logic in creases.

## Game Studio checklist
- [x] Pre-code skill application recorded before runtime edits.
- [x] Asteroid-only pass implemented.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest asteroid-only gate recorded.
- [ ] Gold-standard asteroid gate achieved.

## Next visual fix
- Stay asteroid-only. Push one more pass that specifically attacks the remaining tiled/procedural read: stronger transition zones between dust-coated planes and rubble belts, more asymmetric crater breakage, darker crevice occlusion, and more convincing mineral/regolith clustering.
