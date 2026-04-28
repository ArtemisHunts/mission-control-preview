# Visual Review — 2026-04-28 Concept C brutal depth continuation pass

Commit under review: pending WIP
Screenshot: docs/visual-reviews/2026-04-28-concept-c-brutal-depth-pass.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | playtest-fix
Skill focus: keep going toward Concept C by killing the horizontal clam-shell read, adding brutal vertical mass, and deepening carved command-shaft depth.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — diagonal roof tongue, black undercut, rear command shaft wall, lower chasm, swallowed roof/columns, and vertical rock intrusions are proxy modules for future asteroid/facility GLB kit work.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: focused WIP continuation pass; no live deployment.
- web-game-foundations: render-only scene changes on `concept-c-wip`; no interaction/state changes.
- three-webgl-game: added grouped geometry for brutal mass/depth while preserving camera and open star-corner composition.
- web-3d-asset-pipeline: strengthened reusable blockout vocabulary for collapsed roof tongues, chasm masks, swallowed architecture, and rear shaft voids.
- game-ui-frontend: not-applicable beyond preserving the current HUD/readout.
- game-playtest: captured local CDP screenshot and ran visual gate. Verdict: clearly improved/save WIP/soft ship for menu readability, but not absolute gold-standard.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — asteroid mass and asymmetry are much stronger; horizontal clam-shell DNA remains but is reduced.
Station visibility: 4/5 — production and command zones remain readable despite heavier rock occlusion.
Lighting/readability: 4/5 — cyan command shaft and warm production lights hold hierarchy; some right-side dark forms are close to merging.
Depth/scale: 4/5 — rear shaft wall, lower chasm, and black undercuts finally make the command center feel deeper.

What changed:
- Added `buildBrutalMassDepthPass()`.
- Added left-center collapsed roof spine and right-center diagonal roof tongue to interrupt the parallel top/bottom bands.
- Added black undercuts, rear command shaft wall, lower-center chasm, and diagonal chasm slice to cut the flat floor/platform read.
- Added rock bites/clamps that physically interrupt left fabrication roof, central bridge, and right bay column.

Visual gate summary:
- Concept match: 4.0/5
- Breaking horizontal clam-shell read: 3.3/5
- Asteroid mass/asymmetry: 4.1/5
- Open star corners: 3.8/5
- Carved integration: 4.0/5
- Production readability: 4.2/5
- Command pit/depth: 4.3/5
- Lighting/materials: 4.0/5
- Overall: ~4.0/5

Gate verdict:
- Improved from prior WIP: yes, clearly.
- Save WIP: yes.
- Ship: soft ship / portfolio-passable for menu readability, but not absolute gold-standard Concept C.

Remaining issue:
- The piece still carries some horizontal cutaway strip DNA. If time allows, do one final small silhouette-only pass: larger upper-right/center missing bite or one taller asymmetric side mass. Do not keep noodling interior props; the weakness is silhouette/massing, not room detail.
