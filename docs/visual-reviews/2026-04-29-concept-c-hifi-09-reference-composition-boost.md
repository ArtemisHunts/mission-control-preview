# Visual Review — 2026-04-29 Concept C HIFI-09 reference composition boost

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-09-reference-composition-boost.png`
References benchmarked: `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, HIFI-08 screenshot/review.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | cavern-depth | facility-density
Skill focus: HIFI-09 manual reference-match composition boost — continuous oval asteroid aperture, giant right space window, dominant blue chasm, denser industrial city.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael asked to keep pushing; the job is still reference-match, not local texture polish.
- web-game-foundations: keep cron paused and push manually so network/provider noise does not corrupt branch state.
- three-webgl-game: force the thumbnail read with a continuous oval aperture, brighter right-side exterior opening, more central chasm hierarchy, and more visible industrial density.
- web-3d-asset-pipeline: use modular placeholder geometry as composition carriers for later authored GLB assets.
- game-ui-frontend: not-applicable — preserve existing camera controls only.
- game-playtest: run syntax/diff checks, capture direct-CDP screenshot, and grade against the supplied reference brutally.

North-star question: does the screenshot now read closer to the reference at thumbnail scale — oval cavern, right space opening, central blue chasm, and embedded city?
North-star verdict: closer, but still not close enough.

## What changed
- Widened the default/wide camera a bit to emphasize the full cavern thumbnail composition.
- Added `buildHifi09ReferenceCompositionBoost()` as an overlay pass on top of HIFI-08:
  - continuous dark oval asteroid aperture ring
  - inner warm/cold rim highlights
  - extra chunky foreground rim masses to make the frame feel heavier
  - much brighter/larger right-side space window with frame, haze, stars, and a tiny ship silhouette
  - dominant multi-ring blue central chasm overlay with deeper glow and vertical braces
  - denser embedded industrial city modules across left cyan bay, warm central core, right hangar, and rear skyline
  - additional high gantries and practical light strips
  - stronger right-window cold light, central chasm light, and warm city light
- Updated cache-bust string and readout copy.

## Screenshot / gate notes
- Local static preview served from `http://127.0.0.1:4173/`.
- Smoke checks passed:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Screenshot captured through direct CDP:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-09-reference-composition-boost.png`

## Gate scores
Concept match: 2.7/5 — the oval read is much clearer, but the reference still has much stronger asymmetry, atmosphere, and industrial specificity.
Container/shell: 3/5 — stronger continuous oval aperture, but too clean/ring-like and not enough natural broken asteroid silhouette.
Station visibility: 2/5 — more city modules exist, but density is still too sparse and too dark compared with the reference.
Lighting/readability: 2/5 — right/cyan/chasm lights improved, but the frame remains underexposed and loses too much detail in black.
Depth/scale: 3/5 — central chasm and oval frame read better, but the cavern still feels like a staged diorama, not kilometers deep.
Material richness: 2/5 — still procedural/blocky; no real authored rock/metal material quality yet.
Production / facility fidelity: 2/5 — extra modules/gantries help, but nowhere near the reference’s dense industrial city.
Performance / readiness: 3/5 — code checks passed and screenshot captured; app remains stable despite more geometry.
Lighting/readability note: exposure and light hierarchy are now the next blocker. The scene is dark like the reference, but not readable like the reference.

Overall visual gate: 2.7/5

## What moved closer
- The screenshot now has an obvious oval asteroid aperture at thumbnail scale.
- The central blue chasm is more dominant than HIFI-08.
- Right-side exterior opening is brighter and more legible.
- Industrial city density increased across the visible bands.

## What is still off
- The oval is too smooth and portal-like; it needs jagged asteroid interruption.
- The right-side space window is still not spectacular enough.
- The city is still sparse/simple and needs 3–5x more tiny readable structure.
- Lighting remains too black/flat; the reference is dark but still rich and readable.
- The central pit still does not feel like a massive excavated vertical shaft.

Game Studio checklist:
- [x] Pre-code skill application recorded before runtime edits.
- [x] Exactly one thesis chosen: HIFI-09 reference composition boost.
- [x] Runtime scene path updated around that thesis.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest gate recorded.
- [ ] Gold-standard reference gate achieved.

Next visual fix:
Do not return to micro rock texture. Next pass should:
1. roughen/break the oval rim so it feels like asteroid, not a portal,
2. make the right space window larger/brighter with exterior asteroid/starfield depth,
3. turn the central chasm into a deep bowl/shaft with lower visible ring levels,
4. brighten and multiply the industrial city detail by at least 3x,
5. add atmospheric haze and stronger cyan/amber/white-blue light hierarchy.
