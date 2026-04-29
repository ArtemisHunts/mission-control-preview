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
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael identified the top-right corner as dead weight and the exterior entrance texture as an artifact.
- web-game-foundations: remove/occlude the bad quadrant cleanly without adding compute-heavy filler.
- three-webgl-game: cut the top-right quadrant out of the dense shell/rim mesh and overlay clean space/back-depth where old noisy layers showed through.
- web-3d-asset-pipeline: preserve shell/rim/facility separation and make the cleanup reversible/tweakable.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does removing the top-right corner open the facility/back read and eliminate the crunchy exterior texture artifact?
North-star verdict: slight improvement; top-right removal helps, but the fuzzy exterior artifact and right-side black slab still hurt the read.


## What changed
- Added HIFI-16 top-right corner removal.
- Cut the top-right quadrant out of the HIFI-12 dense shell/rim generation, not just a visual overlay.
- Added clean open-space treatment, stars, rear hangar glow, and visible rear facility details in the removed area.
- Added retained broken rim chunks so the cut does not feel completely empty.
- Updated cache bust/readout and deployed Pages to `6d08591`.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-16-top-right-corner-cleanout-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-16-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-16-side-by-side.png`

## Gate scores
Concept match: 3.0/5 — still C-, but the top-right cutout direction is better.
Top-right cutout: 3.2/5 — removal helps, but right-side black slab/occlusion still feels like an artifact.
Exterior texture cleanup: 2.4/5 — not solved; fuzzy/noisy exterior coating is still visible and reads fake.
Facility visibility: 2.8/5 — not enough; still too dark and hidden.
Asteroid silhouette: 2.5/5 — less boxed on top-right, still too rectangular/sliced overall.
Rock quality: 2.4/5 — inner rim has depth but remains too spiky/repetitive; exterior rock is weak.
Performance/readiness: 3.2/5 — Pages loads, screenshot captured.

Overall visual gate: 2.95/5 / C-

## Honest read
HIFI-16 did the requested surgery, but it exposed deeper issues: the right side still has a slab-like occluder, and the exterior material/noise reads like static instead of rock. The next pass must clean the exterior material language and remove the black slab feeling, not just keep cutting holes.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Runtime scene path updated around HIFI-16.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Eliminate the fuzzy purple/noise exterior artifact and the black right-side slab. Replace them with chunky grey asteroid plates and clearer star/open-space depth, then brighten the facility with larger readable platforms and practical lights.
