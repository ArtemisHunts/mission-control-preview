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
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael pointed to the reference depth: you can see all the way to the back facility, not just a dark foreground hole.
- web-game-foundations: solve this with cutaway proportion, occlusion reduction, and rear-depth macro layers, not polygon spam.
- three-webgl-game: widen the shell cutout, soften old foreground masks, add receding decks/corridor lines, and brighten rear hangar/depth planes.
- web-3d-asset-pipeline: preserve separable layers: front shell, mid decks, rear facility, rear hangar light, cheap scale lights.
- game-ui-frontend: not-applicable — cache/readout only.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: can we now see through the asteroid base to the rear facility/hangar like the corrected reference?
North-star verdict: slight improvement, but still not enough; back facility is more visible, yet the read remains shallow/boxy rather than deep like the reference.


## What changed
- Added `buildHifi15DeepViewportRevealPass()`.
- Further widened the HIFI-12 cutout generator and reduced legacy foreground/rear/upper occlusion masks.
- Added a front-to-back visibility wash, receding facility deck layers, perspective rails/ramps, rear hangar backplate, towers, cranes, practical lights, and depth lights.
- Updated cache bust/readout and deployed Pages to `5d62824`.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-15-deep-viewport-reveal-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-15-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-15-side-by-side.png`

## Gate scores
Concept match: 3.0/5 — still C-; this improves the direction but not the overall reference match enough.
Depth to back: 2.8/5 — more rear facility cues, but still reads shallow/stage-like.
Viewport width: 3.1/5 — wider, but too clean/horizontal and not organic enough.
Facility readability: 2.8/5 — macro forms visible; infrastructure still too simplified.
Asteroid silhouette: 2.4/5 — too rectangular/capsule/symmetrical compared with the lumpy reference asteroid.
Rock quality: 2.3/5 — procedural spike/crystal read still hurts badly.
Lighting/readability: 2.7/5 — better rear lights, still too dark/flat inside.
Performance/readiness: 3.2/5 — Pages loads, screenshot captured.

Overall visual gate: 2.95/5 / C-

## Honest read
HIFI-15 does expose more back-facility information, but the improvement is capped by the same two big problems: the asteroid silhouette is still too regular/boxy, and the interior still reads like a simplified stage instead of a deep industrial cutaway. More widening alone will not solve it unless the outer body and interior depth architecture become more natural and layered.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Runtime scene path updated around HIFI-15.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Break the rectangle/capsule silhouette and spike field. Build the asteroid as a lumpy asymmetric boulder with an uneven mouth, then place larger multi-level industrial platforms/tunnels visibly receding to the rear.
