# Visual Review — 2026-04-29 Concept C HIFI-11 asymmetric asteroid mass pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-11-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-11-side-by-side.png`
References benchmarked: `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, HIFI-10 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting
Skill focus: HIFI-11 kill the clean oval/portal read by replacing it with asymmetric high-mass asteroid slabs and jagged cavern occlusion.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael said keep moving; the bottleneck is now obvious and narrow: stop decorating the perfect oval.
- web-game-foundations: keep the scene shippable while changing the silhouette aggressively enough to matter.
- three-webgl-game: reduce HIFI-09 ring dominance, add irregular foreground rock masses in front of the aperture, and keep the right space opening/city visible.
- web-3d-asset-pipeline: use dense procedural panels as proxy asteroid mass; every new object must serve silhouette, cavern thickness, or reference scale.
- game-ui-frontend: not-applicable — only update the readout/cache string.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side review, blunt gate.

North-star question: does the current view stop reading as a clean oval sci-fi viewport and start reading as one broken asymmetric hollow asteroid cavity?
North-star verdict: slightly closer, but still not close enough; the clean portal/viewport read survived.


## What changed
- Reduced the HIFI-09 continuous oval ring opacity so it stops dominating quite as hard.
- Added `buildHifi11AsymmetricAsteroidMassPass()` after HIFI-10.
- Added hard foreground occlusion masks to break the circular aperture into a jagged cave mouth.
- Added four dense foreground asteroid mass panels: upper roof, left wall, lower sill, right cheek.
- Added broken warm/cold cut faces on the inner rim rather than one continuous rim line.
- Preserved the right exterior opening, central shaft, and city scale lights so the scene does not collapse into a black rock blob.
- Deployed Pages to `e75b4e5` and captured live proof plus side-by-side.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-11-asymmetric-asteroid-mass-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-11-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-11-side-by-side.png`

## Gate scores
Concept match: 2.6/5 — improved from HIFI-10, but still mostly “oval aperture with sci-fi base,” not the reference's massive asteroid cavern.
Container/shell: 2.6/5 — more asymmetric mass exists, but the viewport/portal read still survives.
Station visibility: 2.4/5 — scale pinlights increased, but the facility remains too sparse and toy-like.
Lighting/readability: 2.2/5 — still too dark/flat; reference has dark contrast plus readable blue/amber pools.
Depth/scale: 2.6/5 — stronger foreground occlusion and shaft depth, but not vast enough.
Material richness: 2.3/5 — rock is noisier and chunkier, still not authored/mineral-rich enough.
Performance / readiness: 3/5 — Pages loads and screenshot capture works.

Overall visual gate: 2.45/5

## Honest read
HIFI-11 is progress, but it did not clear the bottleneck. It weakens the clean oval and adds real asteroid mass, but the scene still reads like a graphic window/portal with rocks around it. The next pass needs to be more destructive: remove or bury the remaining ring geometry and recompose the shell as a lopsided asteroid body with one irregular cavern cut.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Exactly one thesis chosen: HIFI-11 asymmetric asteroid mass.
- [x] Runtime scene path updated around that thesis.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Stop preserving the oval. Hide/remove the RingGeometry aperture entirely and rebuild the shot around 5-7 large asymmetric asteroid lobes with a non-elliptical negative space, then brighten the embedded industrial city enough to read at thumbnail scale.
