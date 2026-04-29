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
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael correctly called out the upper section still chokes the facility reveal.
- web-game-foundations: open the view with targeted compositional cutout and macro facility visibility, not random extra geometry.
- three-webgl-game: mask/carve the top-center shell read, rebuild the upper rim as chunky broken rock, and reveal upper/rear deck layers.
- web-3d-asset-pipeline: preserve separable modules: upper void, broken rim, upper decks, hangar, crane silhouettes, lights.
- game-ui-frontend: not-applicable — only cache/readout text.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does removing more upper mass make the facility read clearly while keeping the asteroid body believable?
North-star verdict: slight improvement, but not enough; upper opening is bigger but the facility still hides in darkness and the asteroid still reads too tube/cross-section-like.


## What changed
- Added `buildHifi14UpperCutawayPulloutPass()`.
- Added a top-center negative-space pullout to visually remove more upper shell mass.
- Rebuilt a retained chunky upper rim with broken rock lobes and warm cut-face highlights.
- Added newly revealed upper facility decks, rear hangar aperture, crane silhouettes, upper pinlights, and readability lights.
- Updated cache bust/readout and deployed Pages to `403a9bb`.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-14-upper-cutaway-pullout-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-14-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-14-side-by-side.png`

## Gate scores
Concept match: 3.0/5 — still C-; upper removal helps but not a major jump.
Upper opening: 3.1/5 — more open, but too smooth/horizontal and still not a naturally blasted asteroid cavity.
Facility visibility: 2.8/5 — more upper hints, but core facility remains too dark and vague.
Asteroid silhouette: 2.5/5 — still too capsule/tube-like instead of lumpy exterior asteroid.
Rock quality: 2.4/5 — repetitive spikes/procedural teeth remain a visual tax.
Lighting/readability: 2.6/5 — added lights help, but interior remains underreadable.
Efficient asset quality: 3/5 — targeted pass, no polygon spam.
Performance/readiness: 3.2/5 — Pages loads, screenshot captured.

Overall visual gate: 2.95/5 / C-

## Honest read
HIFI-14 did the requested upper pullout, but the improvement is modest. The upper opening is more visible, but the facility still needs to come forward and brighten. The real next bottleneck is no longer just ceiling mass — it is the overall read: outer asteroid silhouette must become lumpy and natural, the front cavity must be more irregular, and the facility must be brighter/more macro-readable.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Runtime scene path updated around HIFI-14.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Stop only shaving the top. Push the facility forward and brighter, create a stronger rear hangar aperture, break the exterior asteroid silhouette into lumpy asymmetry, and replace repetitive spike fields with larger varied fractured rock plates.
