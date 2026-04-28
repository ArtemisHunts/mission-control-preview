# Visual Review — 2026-04-28 Concept C HIFI-02 secondary-breakup WIP

Commit under review: `81c3339` + manual screenshot follow-up
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hifi-02-secondary-breakup.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md, docs/visual-reviews/2026-04-28-concept-c-hifi-01-shell-shaft.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition | playtest-fix
Skill focus: HIFI-02 secondary asteroid breakup — fracture networks, chipped edge clusters, crater/rubble surface detail, and stronger cut-face value separation without collapsing the open-corner cutaway.
Asset pipeline stance: modular-GLB-planned — procedural shell breakup pass now, future GLB replacement still expected for hero asteroid/facility kits.
Playtest status: screenshot-captured-after-cron-harness-failure

Pre-code Game Studio application:
- game-studio: take exactly one ladder step toward the gold-standard hi-fi asteroid shell instead of noodling props.
- web-game-foundations: preserve the approved camera, open-corner composition, and stable runtime while concentrating new complexity in the shell layer.
- three-webgl-game: add secondary breakup with lightweight procedural geometry/material cues that deepen the rock read without nuking performance.
- web-3d-asset-pipeline: treat this as a shell-detail kit pass — chips, fracture planes, craters, rubble pockets, underside occlusion, rim accents.
- game-ui-frontend: not-applicable beyond preserving the current HUD shell.
- game-playtest: try local screenshot/CDP capture after the pass; if the worker still blocks it, record the blocker precisely and do not fake a gate.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer, but not HIFI-approved

Container/shell: 3/5 — closer structurally. The shell now has a second breakup layer, but still reads too broad/low-poly for high-fidelity concept art.
Station visibility: 3/5 — unchanged by design; this pass did not add facility clutter that should bury the stations.
Lighting/readability: 3/5 — cyan/warm hierarchy works, but value range is still too gentle and the asteroid material remains too uniform.
Depth/scale: 2.5/5 — shell depth improved, but command shaft and facility depth remain too shallow/stage-like.

Concept match: 3.0/5 — concept reads clearly, but the image still feels more like a clean procedural layout than high-fidelity concept art.
Improvement over HIFI-01: 3.0/5 — improved structurally, not enough materially.
Asteroid shell fidelity: 2.5/5 — silhouette and breakup improved, but surfaces remain broad, graphic, and low-poly.
Material richness: 2.0/5 — rock/metal/glass/emissive separation is still weak; purple-gray rock dominates too evenly.
Carved integration: 2.5/5 — facility sits inside the asteroid but is not yet drilled/bolted/sealed into it.
Command shaft depth: 2.0/5 — central holo-table reads, but vertical shaft drama is shallow.
Production/facility fidelity: 2.0/5 — left production hints exist, but machinery/infrastructure density is still too sparse.
Lighting/depth: 3.0/5 — cyan/warm focal lights help; needs stronger occlusion, rim hits, haze, and depth gradients.
Performance/readiness: 3.5/5 — stable and worth continuing.
Overall: 2.6/5

Lighting/readability note:
- No global light rig change. This pass attacks readability through shell-local value separation: darker undersides, warmer cut rims, cooler recesses, and front-facing crater/dust decals.
- Cron harness note: the autonomous job marked the run as failed because its canvas/screenshot step failed, even though it committed `81c3339` successfully. A manual follow-up started the OpenClaw browser/CDP path and captured the screenshot successfully.

Game Studio checklist:
- pre-code skill application recorded before implementation.
- three-webgl-game: camera/fog/light rig preserved; added one new procedural shell-detail layer plus hifi color tuning; `node --check --input-type=module < app.js` passed.
- web-3d-asset-pipeline: shell breakup is now more modular and closer to a future GLB replacement kit: shard clusters, fracture plates, crater decals, rubble pockets, underside wedges, rim accents.
- game-playtest: `git diff --check` passed in the cron run; manual follow-up captured screenshot and ran the visual gate.

What moved closer:
- Added a dedicated HIFI-02 shell-detail layer instead of more room props.
- Broke the large shell masses with secondary chipped clusters across the crown, wall cheeks, and lower sills.
- Added smaller cut planes, crater pockets with dust halos, fracture bands, and rubble pockets so the asteroid should read less decorative and more excavated.
- Tuned procedural rock color so exposed upper faces can run warmer while deeper planes cool/darken.
- Added underside shadow wedges and chipped rim accents to strengthen depth on the lower shelves and overhangs.

What is still off:
- Screenshot/gate now exists; HIFI-02 is saved WIP but not approved as high-fidelity.
- Carved facility integration kit still needs the HIFI-03 collar/rib/conduit/AO pass.
- Command shaft depth and production bay fidelity are still behind the shell work.
- The shell may still read too faceted/graphic until a real screenshot proves the new breakup is doing enough.

Next visual fix:
- Move to HIFI-03 carved integration kit: metal collars, retaining ribs, conduits drilled into rock, contact AO, debris/contact piles, and deeper command-shaft layering. Also update the autonomous loop prompt to avoid treating screenshot harness failures as full build failures when code/checks/commit succeed.
