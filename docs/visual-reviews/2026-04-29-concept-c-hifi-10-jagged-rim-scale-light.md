# Visual Review — 2026-04-29 Concept C HIFI-10 jagged rim / scale light pass

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-10-live-pages.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-10-side-by-side.png`
References benchmarked: `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, HIFI-09 side-by-side.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting
Skill focus: HIFI-10 break the portal-clean oval, increase right-window spectacle, multiply visible city scale lights, and improve readable cyan/amber atmosphere.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael asked to keep the loop moving; the useful next pass is a single brutal correction against the HIFI-09 self-critique.
- web-game-foundations: Pages was explicitly shipped first; this pass stays on concept-c-hifi until screenshot/gate evidence exists.
- three-webgl-game: break the smooth oval with jagged asteroid bite silhouettes, add brighter atmospheric planes, lower shaft rings, and dense tiny-scale industrial marks.
- web-3d-asset-pipeline: keep geometry modular/procedural but make every new primitive serve scale, silhouette, or light hierarchy.
- game-ui-frontend: not-applicable — no HUD/UI work beyond cache/readout string.
- game-playtest: run module syntax/diff checks, capture current screenshot, and publish side-by-side proof.

North-star question: does HIFI-10 stop reading as a clean sci-fi portal and start reading as a jagged hollow asteroid cavern with a believable industrial city inside?
North-star verdict: not close enough; HIFI-10 adds useful scale-light attempts but still reads as a clean portal/viewport rather than a rugged asteroid cavern.


## What changed
- Added `buildHifi10JaggedRimScaleLightPass()`.
- Broke the too-clean HIFI-09 oval with jagged foreground asteroid bites, chips, and warm exposed cut highlights.
- Strengthened the right-side space opening with bloom, exterior asteroid silhouettes, and a stronger cold key light.
- Multiplied city scale markers with dense cyan/amber pinlight matrices across left bay, central core, right hangar, and rear skyline.
- Added lower visible shaft rings plus blue mist so the central pit reads deeper.
- Added cyan/amber/rear atmosphere planes to separate foreground rock, facility, and rear cavern.
- Updated readout copy and cache-bust string for HIFI-10.

## Screenshot / gate notes
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Local headless Chrome capture failed repeatedly, but live Pages was successfully captured through the managed browser/CDP after deploy.
- Screenshot captured from live Pages after main updated to `720e2be`:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-10-live-pages.png`
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-10-side-by-side.png`

## Gate scores
Concept match: 2.4/5 — only the oval aperture/base-inside idea matches; the reference's asteroid mass, asymmetry, cinematic scale, and industrial complexity are still missing.
Container/shell: 2.2/5 — HIFI-10 tried to jag the rim, but the dominant read is still a clean oval portal/viewport.
Station visibility: 2.4/5 — additional scale lights exist but the facility still reads sparse and blocky, not like a dense embedded industrial city.
Lighting/readability: 2.1/5 — still too dark/flat; reference is dark but materially rich and readable.
Depth/scale: 2.5/5 — central shaft reads a little deeper, but the scene still feels like a small diorama, not a kilometer-scale asteroid excavation.
Material richness: 2/5 — rock is rougher in spots but still procedural/noisy and not convincingly authored.
Performance / readiness: 3/5 — Pages loads and browser capture works; headless local capture remains flaky.

Overall visual gate: 2.4/5

## Honest read
HIFI-10 is operationally shipped, but visually it did not solve the core problem. It may have slightly improved scale-light density and central shaft depth, but the giant clean oval still dominates and keeps the whole thing in “portal/window” territory. Next pass needs to reduce/kill the perfect ring read, not decorate it.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Exactly one thesis chosen: HIFI-10 jagged rim + scale light hierarchy.
- [x] Runtime scene path updated around that thesis.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest visual gate recorded from screenshot.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Stop reinforcing the RingGeometry oval. Replace/occlude the clean ring with asymmetric high-mass asteroid chunks and carve the interior as one irregular cavern before adding more tiny detail.
