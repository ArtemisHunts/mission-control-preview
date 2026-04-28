# Visual Review — 2026-04-27 command pit material contrast

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | lighting | composition
Skill focus: make the command pit feel more premium through black-glass panels, bronze trim, and disciplined warm/cool material contrast
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused material/lighting hierarchy pass. Recent loops added enough architecture and activity; this pass improves the expensive north-star read by tightening command-pit materials.
- web-game-foundations: Touch render-scene structure only via a new command pit material builder in `buildOffice()`; no state, input, camera, navigation, HUD, or DOM behavior changes planned.
- three-webgl-game: Add broad black-glass floor/ring panels, bronze/copper trim strips, restrained warm desk pools, and darker console caps. Keep camera/fog/exposure stable and avoid prop/detail spam.
- web-3d-asset-pipeline: Primitive-blockout for future modular GLB kits: command pit glass floor panel, bronze bevel strip, console cap, rail lip, table rim insert.
- game-ui-frontend: not-applicable — no DOM/UI; visual quality comes from scene material contrast.
- game-playtest: Run syntax, diff check, macro gate, marker grep, and local browser attempt; browser navigation was blocked, so public Pages visual verification is required.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid border unchanged; all work stays inside the command floor.
Station visibility: 4/5 — Material contrast supports the table/crew read without moving or hiding stations.
Lighting/readability: 4/5 — Warm/cool discipline should make the cyan core and amber operations ring clearer while reducing noisy equal-brightness.
Depth/scale: 4/5 — Black-glass/bronze/graphite layering gives the central pit a more premium, engineered material read.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: unchanged around ~17–22%; no rock/exterior mass changed.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~79–84%; additions are central interior material layers.

Station visibility:
- Four station districts remain in place.
- New pit material hierarchy should make the center feel expensive without adding clutter to the surrounding stations.

Lighting/readability note:
- No global exposure, fog, or camera change was made.
- Readability comes from value/material separation: black glass and dark graphite under cool hologram light, bronze/warm accents around human work zones.
- Local browser screenshot remains blocked by policy; public screenshot verification is needed to confirm the surfaces read at default camera distance.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; broad primitives only, no new loops counted by macro gate.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; additions map to future command deck/pit trim/console cap/rail lip kits.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Added polished black-glass command deck and dark graphite pit liner.
- Added bronze outer/inner bevel rings and a restrained cyan glass seam.
- Added graphite console caps, bronze console lips, and warm operator pools.
- Added stair thresholds, rail catchlights, table-base reflection, and shadow value masses.
- Updated cache-bust marker for deploy.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- If the new transparent/metal layers overcomplicate the center, the next pass should prune opacity or consolidate trim.

Next visual fix:
- Public screenshot pass. If the material hierarchy reads, continue with operator suit identity; if not, simplify trim and tune material opacity.
