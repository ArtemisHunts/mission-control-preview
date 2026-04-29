# Visual Review — 2026-04-29 Concept C HIFI-23 restore bowl opening

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-23-local.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-23-side-by-side.png`
Reference: corrected `docs/reference/concept-c-asteroid-cavern-target.png`

## Trigger
Michael said HIFI-22 was closer, but there was no opening. Correct diagnosis: the unified cup overlay improved cohesion but filled the aperture too much.

## Thesis
Keep the cohesive cup/bowl asteroid body, but cut a clear visible dark mouth back into it and make the roof lip visibly overhang that void. Shape-only; no interior detail.

## What changed
- Added `buildHifi23RestoreBowlOpeningPass()`.
- Hid HIFI-22's unified outer cup overlay and final crescent scoop where they filled the aperture.
- Added a larger obvious dark bowl-mouth opening.
- Added a rear depth shape inside the opening.
- Added dark undercut shadow planes under the roof lip so the overhang reads.
- Added sparse cup-mouth rock lip planes only; no facility/interior decoration.
- Updated readout and cache-bust to HIFI-23.

## Smoke checks
- `node --check --input-type=module < app.js` ✅
- `git diff --check` ✅
- Local server + OpenClaw CDP screenshot capture ✅

## Visual gate scores
Concept match: 3.7/5 — closer to the cup/bowl target, still not final.
Visible opening: 4.0/5 — opening is back and readable.
Cup/bowl cohesion: 3.7/5 — cohesive body mostly preserved.
Roof overhang: 3.8/5 — roof lip reads better with undercut shadow.
Shape-only discipline: 4.3/5 — no interior/detail spam added.
Opening naturalness: 3.2/5 — dark mouth works, but risks reading like a flat black inserted panel.
Performance/readiness: 3.4/5 — screenshot capture works.

Overall visual gate: 3.7/5 / B- to B directionally

## Honest read
This fixed Michael's immediate critique: there is a visible opening again. The cup/bowl body and overhanging roof read are mostly preserved.

Still wrong: the dark aperture is a bit too flat and panel-like. It needs to become a deeper recessed cavern shadow with visible rim depth, not a black object sitting in front of the shell.

## Next visual fix
HIFI-24 should keep the opening size, but convert the black aperture into a deeper recessed void:
- soften and recess the central dark shape
- add rim-depth contour/shadow layers inside the mouth
- keep the roof overhang strong
- avoid interior props/details
- preserve the cohesive cup/bowl silhouette
