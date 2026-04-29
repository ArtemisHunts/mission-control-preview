# Visual Review — 2026-04-28 Concept C HIFI-04A poly-density-foundation pass

Commit under review: current `concept-c-hifi` HEAD — pending commit for HIFI-04A
Branch: `concept-c-hifi`
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hifi-04a-poly-density-foundation.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md, docs/visual-reviews/2026-04-28-concept-c-hifi-04-command-shaft-depth.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | geometry | playtest-fix
Skill focus: replace the folded-paper asteroid mantle with materially denser rock geometry, multi-scale fracture breakup, and reusable shell-surface generation that reads like carved mass instead of a few big slabs.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: take the foundation step Michael explicitly called out. Make the asteroid mass itself feel premium before touching more polish bait.
- web-game-foundations: preserve the approved camera, star-corner openings, and facility silhouette while shifting complexity into the shell surfaces and cutaway rims.
- three-webgl-game: replace broad low-segment mantle chunks with subdivided displaced custom BufferGeometry, then layer medium/small fracture systems so density comes from real vertices and silhouette variation.
- web-3d-asset-pipeline: build the shell pass as a reusable procedural surface generator that can later be swapped for authored GLB shell sections without redoing scene composition.
- game-ui-frontend: not-applicable — preserve the current HUD shell.
- game-playtest: run syntax/diff checks, recover a real screenshot, and grade the pass honestly against the gold-standard cutaway instead of mistaking extra code for visible fidelity.

North-star question: Does the asteroid shell finally read like massive carved stone with dense fracture structure instead of a few visible extruded polygons?
North-star verdict: closer

Container/shell: 4.0/5 — the shell now reads as a real asteroid body first, with denser carved mass and less broad folded-paper slab energy than HIFI-04.
Station visibility: 3.25/5 — the facility still reads, but the richer shell now competes harder with interior bays and the center needs a cleaner hierarchy pass.
Lighting/readability: 3.4/5 — value separation is still workable, though some shell bands and darker mid-values crowd the room more than the prior shaft-focused pass.
Depth/scale: 3.5/5 — the asteroid mass feels bigger and more swallowing, but the command core lost some of HIFI-04's vertical drama.

Concept match: 3.9/5 — materially closer to the gold-standard asteroid cutaway because the rock body finally dominates the composition.
Improvement over HIFI-04: 3.75/5 — real forward progress on shell fidelity and carved-mass credibility, with a modest readability tradeoff that still needs cleanup.
Asteroid shell fidelity: 4.0/5 — this is the first hi-fi shell pass that stops reading like a few low-poly mantle chunks and starts reading like a dense carved asteroid surface.
Material richness: 3.5/5 — richer than HIFI-04 thanks to denser geometry, layered rim breakup, and fracture webs, but still not premium enough on dust/grime/metal-vs-rock separation.
Carved integration: 3.8/5 — the facility feels more buried inside the asteroid now instead of fronted by decorative shell pieces.
Command shaft depth: 3.0/5 — acceptable but slightly regressed from the dedicated HIFI-04 shaft pass; the shell win did not also deepen the command drop.
Production/facility fidelity: 3.0/5 — unchanged structurally; still readable support geometry rather than gold-standard hero machinery.
Lighting/depth: 3.4/5 — better rock mass and framing, but not yet enough contrast discipline around the center and side bays.
Performance/readiness: 3.8/5 — browser-native dense geometry remained stable, syntax/diff gates passed, screenshot capture succeeded, and the browser console was clean on the captured target.
Overall: 3.7/5

What moved closer:
- Replaced the old shell's broad prism-first mantle read with a reusable dense rock panel generator using custom BufferGeometry, clipped front-face tessellation, stepped depth layers, and inset rim bands.
- Increased actual geometric richness across the main shell plates instead of faking hi-fi with a few big faceted slabs.
- Added multi-scale fracture ribbons and denser cut-plane treatment so the rock body carries more carved/mined structure.
- Preserved the open star corners and the embedded-facility composition while making the asteroid feel heavier and more asymmetric.
- Added a fresh `index.html` cache-bust so the screenshot target definitely loaded the new shell code.

What is still off:
- Some upper shell regions are still busier than they should be and need calmer large planes around the interior opening.
- The command shaft lost some of the HIFI-04 monumentality; this pass solved shell density more than center-depth drama.
- Production bays still need real machinery replacement and stronger lighting hierarchy to compete with the upgraded rock mass.
- Rock-vs-metal value separation is still too compressed in places, especially where dark shell bands meet darker facility modules.

Game Studio checklist:
- pre-code skill application recorded before runtime edits in this review file.
- three-webgl-game: `node --check --input-type=module < app.js` passed and `git diff --check` passed after the dense-shell tuning pass.
- web-3d-asset-pipeline: the new shell builder is reusable procedural infrastructure for later authored replacement rather than a one-off prop cluster.
- game-playtest: local static server + direct CDP screenshot recovery succeeded again via `/json/new` target creation and `Page.captureScreenshot`; browser console on the captured page was clean.

Next visual fix:
- Return to HIFI-04B with a shell-aware command-shaft restoration pass: keep this denser asteroid body, then rebuild stronger vertical drop/value separation in the center so the command core regains its monumental depth without reverting to low-poly shell slabs.
