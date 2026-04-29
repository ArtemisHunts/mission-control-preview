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
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael likes the HIFI-12 direction but wants the opening wider so the facility becomes the hero.
- web-game-foundations: widen by changing cutaway proportions and visibility layers, not by brute-force adding random geometry.
- three-webgl-game: enlarge the efficient shell cutout, reduce old shadow occlusion, and add readable macro decks/pit/hangar shapes.
- web-3d-asset-pipeline: preserve modular asset separation: shell/rim, facility decks, pit, hangar, cranes, lights.
- game-ui-frontend: not-applicable — only cache/readout text.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side, gate.

North-star question: does the wider opening show enough facility to resemble the corrected asteroid-base cutaway reference while still feeling like a solid asteroid shell?
North-star verdict: yes, facility visibility improved slightly; still C- because the asteroid reads too tubular/oval and the rock/interior are not cinematic enough.


## What changed
- Widened HIFI-12's cutaway proportions horizontally and vertically.
- Reduced older hard shadow masks so they stop hiding the facility.
- Added `buildHifi13WideFacilityRevealPass()`.
- Added broader visible facility macro layers: upper/lower terraces, central operations bridge, rear catwalk.
- Added readable central pit rings/core, larger rear hangar/tunnel, crane silhouettes, and more warm/cyan scale lights.
- Updated cache bust/readout and deployed Pages to `e16612e`.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-13-wide-facility-reveal-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-13-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-13-side-by-side.png`

## Gate scores
Concept match: 3.0/5 — widening helped; now reads more like an asteroid cutaway with visible base, but still far from the reference.
Opening/facility visibility: 3.1/5 — better view into the facility, but still too sparse and dark.
Asteroid silhouette: 2.5/5 — too tube/oval-like; not an irregular free-floating asteroid chunk yet.
Rock quality: 2.4/5 — still procedural/spiky/repetitive rather than chunky fractured rock.
Interior density/readability: 2.7/5 — macro decks/pit/hangar improved, still not dense or cinematic enough.
Lighting/readability: 2.6/5 — improved practical light read, still too flat/dim.
Efficient asset quality: 3.1/5 — more useful geometry and visibility without going polygon-soup.
Performance/readiness: 3.2/5 — Pages loads, screenshot captured.

Overall visual gate: 2.9/5 / C-

## Honest read
HIFI-13 did what Michael asked: the opening is wider and the facility is more visible. This is a real step. The new problem is clearer now: the asteroid body reads too much like a sliced tube/shell, not a naturally irregular exterior asteroid with a broken front cutaway. Next pass should push outer silhouette and rock mass, while keeping the widened visibility.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Runtime scene path updated around HIFI-13.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Keep the wider mouth, but break the tube read: make the outer asteroid lumpy/asymmetric, reduce spiky procedural teeth, add chunky fractured planes on the rim, and increase interior macro density with lit platforms/cranes that match the corrected reference.
