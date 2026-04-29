# Visual Review — 2026-04-29 Concept C HIFI-21 cohesive shape reset

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-21-local.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-21-side-by-side.png`
Reference: corrected `docs/reference/concept-c-asteroid-cavern-target.png`

## Trigger
Michael said HIFI-20 looked more cluttered and less cohesive, and that we are still only trying to get the shape right. This pass intentionally stops adding detail and resets the read around silhouette/opening only.

## Thesis
Hide the recent clutter/detail stacks and rebuild one cohesive asteroid body with a single large carved mouth. Shape first. No interior decorating.

## What changed
- Added `buildHifi21CohesiveShapeResetPass()`.
- Suppressed old HIFI-07/HIFI-09 through HIFI-20 detail/facility/shell clutter stacks at render time.
- Added four broad cohesive asteroid masses only: upper crown, left lobe, lower sill, right cheek.
- Added one large clean mouth/negative-space polygon and one simple rear depth shape.
- Kept only minimal rim planes to show thickness.
- Removed crater/chip/light/detail escalation from the visible read.
- Updated readout and cache-bust to HIFI-21.

## Smoke checks
- `node --check --input-type=module < app.js` ✅
- `git diff --check` ✅
- Local OpenClaw CDP screenshot capture ✅

## Visual gate scores
Concept match: 3.4/5 — closer directionally; not a strong target match yet.
Clutter reduction: 4.0/5 — materially cleaner and easier to read.
Cohesive single asteroid shape: 3.6/5 — more unified than HIFI-20, but side masses still feel pillar-like.
Opening / mouth shape: 3.3/5 — large and dominant, but still too rectangular/architectural.
Asteroid naturalness: 3.1/5 — surface supports the idea, but the macro shape still reads like a bridge/tunnel frame.
Interior restraint: 4.2/5 — good; no new interior decoration.
Performance/readiness: 3.4/5 — simpler visible scene and screenshot capture works.

Overall visual gate: 3.6/5 / B- directionally

## Honest read
This is a better direction than HIFI-20 for Michael's critique. It is less cluttered, more cohesive, and the large carved opening is finally the dominant shape. But it is not done. The silhouette now risks being too simple and architectural: a stone arch / tunnel frame instead of a naturally hollowed asteroid.

Main remaining shape problems:
- top mass is still too slab-like
- side masses still read like separate vertical supports
- bottom sill/floor is still too flat
- mouth/negative space is still too rectangular
- right point/beak needs to be blunted into rock

## Next visual fix
HIFI-22 should keep the same shape-only discipline and warp the negative space: sag the roof in 2–3 places, raise the bottom irregularly, curve side walls inward, round off the right beak, and make the opening feel like an uneven organic cave hole inside one lumpy asteroid body. Do not add interior elements or surface clutter.
