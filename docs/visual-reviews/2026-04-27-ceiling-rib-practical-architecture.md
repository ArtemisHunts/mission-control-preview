# Visual Review — 2026-04-27 ceiling rib practical architecture

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline
Skill focus: strengthen the overhead architectural spine with broad ceiling ribs and practical strip lighting
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused composition/lighting/asset-blockout pass. Recent loops made the table, crew, and station workspaces clearer; this pass targets the north-star ceiling rhythm and practical light framing.
- web-game-foundations: Touch render-scene structure only through a new ceiling architecture builder in `buildOffice()`; no state, navigation, input, HUD, or DOM behavior changes planned.
- three-webgl-game: Add large readable overhead rib modules, warm practical strip lines, cool command slits, and rear/side ceiling seams. Keep camera/fog/exposure stable, avoid tiny decorative spam, and preserve performance with broad primitive boxes using existing materials/helpers.
- web-3d-asset-pipeline: Primitive-blockout for future modular GLB kits: radial ceiling truss, practical light strip, side service beam, rear hangar header, command oculus support.
- game-ui-frontend: not-applicable — no DOM overlays or text UI; the environment should carry the read.
- game-playtest: Run module syntax, diff check, macro gate, marker grep, and local browser attempt; browser navigation was blocked, so public Pages visual verification is required.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid border/proscenium is unchanged. New ceiling structure reinforces the interior carved-base read without letting rock reclaim the frame.
Station visibility: 4/5 — Overhead ribs and light strips frame the command pit and surrounding stations; they do not alter station layout or hide the workspaces.
Lighting/readability: 4/5 — Warm practicals, dim amber wall washes, and cyan oculus slits add cinematic hierarchy without a global neon wash.
Depth/scale: 4/5 — Large rib modules, side service spines, and a rear hangar header make the room feel more engineered, massive, and north-star-like.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: unchanged around ~17–22%; no asteroid/exterior geometry changed.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~79–84%; all new geometry is engineered interior ceiling architecture.

Station visibility:
- Existing four station districts remain visible.
- New overhead rhythm should help unify them around the command oculus rather than read as isolated pads.

Lighting/readability note:
- No global exposure, fog, or camera change was made.
- Readability improvement comes from broad warm practical strips, dim wall wash slots, and cyan oculus slits.
- Local browser screenshot is still blocked by policy; public screenshot verification is needed to confirm the ceiling reads at default camera distance.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; no new procedural rock spam, no new loops counted by macro gate.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; additions map to future ceiling truss/practical strip/service beam/hangar header kits.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Added six broad overhead command ceiling ribs with inset warm practical strips.
- Added dark service-shadow cheeks so ribs read as physical trusses, not just glowing lines.
- Added side longitudinal service spines and dim amber wall-wash slots.
- Added rear hangar header truss and warm underside strip to strengthen depth.
- Added command oculus supports and cyan slits tying the ceiling to the holographic table.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- Ceiling remains primitive blockout; final material breakup and GLB-grade truss beveling are still future work.
- If the overhead forms crowd the command table, the next pass should prune or raise ribs rather than add more detail.

Next visual fix:
- Public screenshot pass. If ceiling rhythm reads, refine rear hangar/window context; if it competes with the hero hologram, reduce strip opacity and simplify rib count.
