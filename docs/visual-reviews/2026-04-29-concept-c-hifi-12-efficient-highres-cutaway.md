# Visual Review — 2026-04-29 Concept C HIFI-12 efficient high-res cutaway asset pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-12-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-12-side-by-side.png`
References benchmarked: corrected `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, HIFI-11 side-by-side/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition
Skill focus: HIFI-12 efficient high-resolution browser-native asset pass — replace portal optimization with a full asteroid cutaway shell built from dense, editable BufferGeometry.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael clarified both the correct reference and the asset quality bar. We need a full asteroid cutaway asset, not another decorative overlay.
- web-game-foundations: keep browser performance sane by using a few dense BufferGeometry systems, not thousands of independent primitive meshes.
- three-webgl-game: create a high-resolution front asteroid shell/cutaway mesh with useful vertices in silhouette/cut-rim/material-relief zones only.
- web-3d-asset-pipeline: structure the result as future GLB-style modules: asteroid body, cut rim, layered decks, central pit, rear hangar, scale-light scatter.
- game-ui-frontend: not-applicable — no interface work except cache/readout string.
- game-playtest: syntax/diff checks, live Pages capture, side-by-side against corrected target, and honest gate.

North-star question: does the scene now read closer to the actual target — a complete asteroid body floating in space with an irregular carved-open industrial base?
North-star verdict: structurally closer after the reference pivot, but visually still C-/D+; full cutaway reads, rock/interior quality do not.


## What changed
- Added efficient high-resolution asset doctrine to the loop docs.
- Added `buildHifi12EfficientHighresCutawayAssetPass()`.
- Built a single dense editable asteroid shell `BufferGeometry` instead of many random primitives:
  - 256 angular segments
  - 14 radial bands
  - about 7k shell triangles concentrated on visible silhouette/material zones
- Added a separate high-resolution carved cut-rim thickness mesh.
- Re-centered the target around the corrected reference: full asteroid body, irregular front cutaway, rear hangar/tunnel light, central lower pit, layered deck proxies, cheap repeated scale lights.
- Updated cache bust/readout and deployed Pages to `f8d7f29`.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Live Pages confirmed serving `app.js?v=concept-c-hifi-12-efficient-highres-cutaway-20260429`.
- Screenshot captured from managed browser/CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-12-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-12-side-by-side.png`

## Gate scores
Concept match: 2.8/5 — better after pivot; now reads more like a full asteroid cutaway than the portal/cavern mistake.
Container/shell: 2.7/5 — full-body asteroid silhouette exists, but it is still too spiky/regular/procedural rather than natural cinematic rock.
Cutaway/rim fidelity: 2.5/5 — large opening exists, but the edge is too uniform and torus-like.
Interior deck/pit/hangar read: 2.1/5 — still too dark and underbuilt compared with the corrected reference.
Lighting/readability: 2.3/5 — exterior silhouette reads better; interior is still underlit/dead.
Efficient asset quality: 3/5 — better architecture: dense meshes where they matter, cheap repeated details where they do not. Visual quality is not high enough yet.
Performance / readiness: 3.2/5 — Pages loads, screenshot captured, geometry is still browser-manageable.

Overall visual gate: 2.65/5

## Honest read
This was the right architectural pivot but not the final visual answer. HIFI-12 is closer because it finally aims at the corrected reference: complete asteroid body + cutaway base. The shell is now an efficient dense mesh, but the result still looks procedural/spiky and the interior is too unreadable. Next pass should improve natural rock massing and interior macro readability, not add more raw triangles.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Efficient high-resolution asset doctrine updated.
- [x] Runtime scene path updated around HIFI-12.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Replace the spiky/radial look with broader natural asteroid lobes and sculpted planes. Then brighten/build the interior macro forms: stacked decks, central pit walls, rear hangar, cranes/gantries, and warm/cyan practical light pools that read at thumbnail.
