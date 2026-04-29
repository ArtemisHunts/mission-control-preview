# Visual Review — 2026-04-28 Concept C HIFI-04B asteroid-fracture-hierarchy pass

Commit under review: current `concept-c-hifi` HEAD — pending commit for HIFI-04B
Branch: `concept-c-hifi`
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hifi-04b-asteroid-fracture-hierarchy.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md, docs/visual-reviews/2026-04-28-concept-c-hifi-04a-poly-density-foundation.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | geometry | lighting
Skill focus: AST-02 surface fracture hierarchy on top of the denser shell foundation, with chipped cut rims, layered strata, richer rock value separation, and asteroid-specific lighting that makes the shell read heavier without spending effort on the interior.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: stay disciplined on Michael's critique. No interior bait. Spend the whole pass making the asteroid itself look expensive.
- web-game-foundations: preserve the approved framing, open star corners, and current facility silhouette while concentrating new density on the shell opening, fracture structure, and rock lighting.
- three-webgl-game: push real mesh richness into the asteroid with multi-scale fracture shelves, chipped bevel rings, crater deformation, and denser strata instead of decorative flat strips.
- web-3d-asset-pipeline: keep the asteroid systems reusable and layered so later authored shell assets can replace or augment them without redoing composition.
- game-ui-frontend: not-applicable — no HUD or interface work this pass.
- game-playtest: syntax/diff checks, screenshot capture, and an honest asteroid-only gate before claiming progress.

North-star question: Does the asteroid shell now read like a thick, fractured carved mass with believable cut rims and rock value hierarchy, instead of a dense but still synthetic shell wrapper?
North-star verdict: closer

Container/shell: 4.2/5 — the shell now wraps the scene more convincingly as one carved asteroid body instead of separated low-poly islands.
Station visibility: 3.1/5 — unchanged by intent, but the denser shell now competes a little harder with the interior silhouette around the opening.
Lighting/readability: 3.6/5 — warmer cut-face pockets and cooler recess rims improved shell depth, though some bands still bunch up into busy mid-values.
Depth/scale: 3.9/5 — the cavity feels thicker and more swallowed by rock, especially at the upper crown and lower sill.

Concept match: 4.1/5 — stronger asteroid-first framing and more believable carved mass than HIFI-04A.
Improvement over HIFI-04A: 3.9/5 — honest forward progress on shell thickness, fracture hierarchy, and asteroid-focused lighting, with some added busyness that still needs hierarchy cleanup.
Asteroid shell fidelity: 3.9/5 — materially closer, but still not gold-standard because broad faceting is still visible in places.
Material richness: 3.4/5 — better warm/cool separation, dust cues, crater rims, and strata shelves, but still short of premium mineral/regolith complexity.
Carved integration: 4.0/5 — the facility feels more excavated inside a single asteroid cavity instead of framed by decorative shell slabs.
Command shaft depth: 3.0/5 — intentionally held flat this pass; no shaft work was done.
Production/facility fidelity: 3.0/5 — intentionally held flat this pass; no facility work was done.
Lighting/depth: 3.8/5 — asteroid-specific warm cut lights and cool recess lights helped the rock body read thicker and more expensive.
Performance/readiness: 3.9/5 — browser-native dense geometry stayed stable, `node --check --input-type=module < app.js` passed, `git diff --check` passed, screenshot capture succeeded, and the captured target was clean.
Overall: 3.8/5

What moved closer:
- Increased actual shell mesh density again by tightening the main mantle panel tessellation, densifying sidewall sampling, and adding deeper layered depth slices inside `buildHifiRockPanel()`.
- Added explicit chipped cut-rim shelves, exposed strata ledges, and darker recessed shelves around the cavity so the opening reads thicker and more excavated.
- Replaced flat-looking fracture strips in the asteroid detail pass with more geometric fracture ribbons and denser rock-panel cut faces.
- Swapped stamped crater marks for chipped crater clusters with rim shards, dust halos, and better local deformation.
- Added asteroid-specific warm/cool fill lights so exposed cut faces and recess pockets read with clearer shell depth instead of one even rock wash.
- Preserved the open star corners and avoided touching command shaft, production bay, props, collars, conduits, HUD, or cache busting.

What is still off:
- The shell is still too visibly faceted in broad areas; it no longer reads as a few big slabs, but it still has a triangulated proxy feel instead of premium carved stone.
- Some fracture and mineral passes are now slightly too busy, especially across the upper shell, and need a calmer hierarchy of large planes versus fine breakup.
- A few long seams still feel art-directed rather than naturally excavated.
- Material richness still needs a true AST-03 pass: more regolith/pitting, darker embedded mineral pockets, and subtler broad-surface value breakup.
- Some shell plates still read thinner than they should, especially where the cavity transitions back into the outer crust.

Game Studio checklist:
- pre-code skill application recorded before runtime edits in this review file.
- three-webgl-game: `node --check --input-type=module < app.js` passed and `git diff --check` passed after the asteroid fracture-hierarchy pass.
- web-3d-asset-pipeline: the shell improvements stayed procedural and layered so later authored shell assets can replace specific systems without rebuilding composition.
- game-playtest: local static server + direct CDP screenshot recovery succeeded via `/json/new` target creation, `Page.reload` with `ignoreCache`, and `Page.captureScreenshot`; the captured target rendered the canvas cleanly.

Next visual fix:
- Move to AST-03 rock material/value richness without drifting back into interior work: keep this thicker fracture hierarchy, then reduce the remaining folded-mesh read with calmer macro planes, deeper regolith/mineral variation, and broader value discipline across the asteroid shell itself.
