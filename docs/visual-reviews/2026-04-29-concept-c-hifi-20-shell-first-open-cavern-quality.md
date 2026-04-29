# Visual Review — 2026-04-29 Concept C HIFI-20 shell-first open cavern quality pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-20-local.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-20-side-by-side.png`
Reference: corrected `docs/reference/concept-c-asteroid-cavern-target.png`

## Thesis
Michael reset the priority: carve more interior space, open the front/entrance wider, raise asteroid shell quality, and stop decorating interior elements for now. HIFI-20 is a shell-first pass: reduce visible facility clutter, expand the cavern mouth/void, and add bigger grey crust plates/fractures/craters.

## What changed
- Added `buildHifi20ShellFirstOpenCavernQualityPass()`.
- Suppressed visible facility/interior detail systems from HIFI-07/HIFI-12/HIFI-18/HIFI-19 so the asteroid shell is the hero again.
- Moved side masses outward and dropped the lower sill to open the front/entrance more.
- Added enlarged empty cavern volume and far rear cavity placeholders instead of new interior props.
- Added larger asteroid shell panels: high upper crown, outward left/right walls, lower sill, rear inner ceiling/floor cut walls.
- Added hard grey chipped entrance bevels, authored shell fracture plates, crater/chip clusters, and shell-focused lighting.
- Updated readout and cache-bust to HIFI-20.

## Smoke checks
- `node --check --input-type=module < app.js` ✅
- `git diff --check` ✅
- Local OpenClaw CDP screenshot capture ✅

## Visual gate scores
Concept match: 3.3/5 — better direction; still not a full clean reference match.
Asteroid-shell focus: 3.7/5 — shell is now the dominant subject, and facility detail is recessed.
Cavern / empty operations volume: 3.3/5 — visibly more open, but still not aggressively hollowed enough.
Front entrance openness: 3.5/5 — wider and more deliberate; still partially obstructed by lip/sill geometry.
Asteroid silhouette / mass: 3.4/5 — chunkier and more asteroid-like, but not enough natural outer-body asymmetry.
Rock material fidelity: 3.0/5 — bigger plates/craters help, but uniform triangular/procedural noise still dominates.
Interior restraint: 3.6/5 — better; should continue hiding/de-emphasizing facility until shell gate improves.
Performance / readiness: 3.1/5 — browser/CDP capture works; geometry remains manageable.

Overall visual gate: 3.4/5 / C+ to B-

## Honest read
This is meaningfully better aligned with Michael's latest direction than HIFI-19. The shell is the hero again, the front is more open, and the interior is less decorated. It finally starts to read as an asteroid cavern shell prepared for a future facility rather than a base diorama wrapped in rock.

Still not enough:
- central void needs another large carveout, roughly 30–50% more perceived empty space
- lower/front lip still blocks too much of the entrance
- ceiling/side walls compress the cavern vertically
- asteroid surface still has too much uniform faceted/noise texture and not enough large geological hierarchy
- outer asteroid silhouette needs bigger natural bulges, bites, gouges, and impact scars

## Next visual fix
HIFI-21 should be another shell-only pass: raise/pull back the ceiling, drop or remove more lower sill obstruction, push side walls farther outward, reduce uniform triangular noise, and rebuild surface hierarchy around fewer/larger rock plates, gouged excavation cuts, and impact scars. Do not add interior elements yet.
