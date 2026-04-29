# Visual Review — 2026-04-29 Concept C HIFI-22 cup/bowl overhang shape

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-22-local.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-22-side-by-side.png`
Reference: corrected `docs/reference/concept-c-asteroid-cavern-target.png`

## Trigger
Michael clarified the target shape: it should feel almost like a cup/bowl with more roof overhang from the rockface. HIFI-21 was cleaner, but too arch/bridge-like.

## Thesis
Keep the scene shape-only, hide HIFI-21's arch read, and rebuild the asteroid as one cohesive rounded cup body with a concave hollow and a forward roof lip.

## What changed
- Added `buildHifi22CupBowlOverhangShapePass()`.
- Hid HIFI-21 visible shape reset at runtime.
- Built broad bowl panels: roof overhang, left curved wall, right curved wall, lower rounded bowl, recessed rear bowl wall.
- Added a final unified outer cup-body overlay to tie sides/roof/floor together and kill the separate-pillar read.
- Replaced rectangular mouth with a darker crescent/bowl negative-space shape.
- Kept the pass shape-only: no interior elements, no facility detail, no lighting/detail spam.
- Updated readout and cache-bust to HIFI-22.

## Smoke checks
- `node --check --input-type=module < app.js` ✅
- `git diff --check` ✅
- Local OpenClaw CDP screenshot capture ✅

## Visual gate scores
Concept match: 3.5/5 — closer in shape intent, but not target-quality yet.
Cup/bowl read: 3.3/5 — partial; now more cohesive, but the hollow is still too shallow/subtle.
Roof overhang: 3.2/5 — present, but needs stronger undercut/shadow and a clearer heavy lip.
Cohesive single body: 4.0/5 — much better; no longer mostly pillars/bridge supports.
Clutter reduction: 4.2/5 — clean, shape-only read preserved.
Opening/mouth naturalness: 3.2/5 — less rectangular than before, but still needs more asymmetrical carved depth.
Asteroid silhouette: 3.6/5 — rounded unified mass works, but risks looking like a flattened loaf/potato.
Performance/readiness: 3.4/5 — screenshot capture works.

Overall visual gate: 3.6/5 / B- directionally

## Honest read
The unified outer body fixed the worst HIFI-21/HIFI-22 issue: it no longer mainly reads as separate side pillars supporting a rock bridge. It is cleaner and more cohesive, and the roof-overhang/bowl idea is starting to show.

Still wrong: the bowl is too subtle. It reads like a shallow dent in a rounded asteroid, not yet a deep hollow cup with a heavy overhanging rim. The next pass should not add detail; it should deepen the hollow and expose the undercut.

## Next visual fix
HIFI-23 should push from shallow dent to open asteroid bowl:
- lower the central bowl floor by 20–30%
- raise/thicken the front/top rim into a clear roof lip
- add a visible dark undercut shadow under the lip
- keep the unified rounded asteroid silhouette
- make the bowl mouth more asymmetrical and obvious
- do not add columns, windows, supports, rooms, platforms, or surface clutter
