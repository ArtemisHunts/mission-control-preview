# Visual Review — 2026-04-27 rear hangar window scale context

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline
Skill focus: anchor the command floor inside an asteroid-base hangar/window backdrop with bold scale cues
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused composition/lighting/asset-blockout pass. Recent loops strengthened the table, crew, station workspaces, and ceiling ribs; this pass targets the remaining north-star gap: rear hangar/window context and exterior scale.
- web-game-foundations: Touch render-scene structure only through a new rear context builder in `buildOffice()`; no state, navigation, input, HUD, or DOM behavior changes planned.
- three-webgl-game: Add a broad rear aperture composition with cool glass haze, docked ship silhouette, gantry/crane arms, receding beacon strips, and rim highlights. Keep camera/fog/exposure stable and keep all forms large enough to read at default view.
- web-3d-asset-pipeline: Primitive-blockout for future modular GLB kits: panoramic hangar window, rear bay frame, docked shuttle silhouette, maintenance crane, beacon/runway strip, exterior haze plane.
- game-ui-frontend: not-applicable — no DOM overlays or labels; the context must read through in-world architecture.
- game-playtest: Run module syntax, diff check, macro gate, marker grep, and local browser attempt; browser navigation was blocked, so public Pages visual verification is required.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The new rear context reinforces the facility-in-asteroid read from inside the existing proscenium without increasing exterior rock dominance.
Station visibility: 4/5 — Rear context sits behind the command floor and supports station scale without changing or hiding the four workspaces.
Lighting/readability: 4/5 — Cool rear glass/haze, cyan runway/rim cues, and amber beacons add depth while preserving warm interior practicals and the cyan table hierarchy.
Depth/scale: 4/5 — Docked shuttle, pressure frame, crane arms, runway recession, side dock shoulders, and distant beacons make the room feel attached to a larger asteroid-base hangar.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: unchanged around ~17–22%; no new exterior proscenium mass was added.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~79–84%; all additions sit inside the rear facility/window context.

Station visibility:
- Existing four station districts remain visible.
- Rear hangar cues should make them feel like workspaces inside a larger base rather than isolated room props.

Lighting/readability note:
- No global exposure, fog, or camera change was made.
- Readability improvement comes from a cool glass/haze layer, cyan runway recession, small amber/red service beacons, and rear rim reflection behind the command table.
- Local browser screenshot remains blocked by policy; public screenshot verification is needed to confirm the rear context reads at default camera distance and does not compete with the hologram.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; broad primitives only, no tiny exterior clutter loops.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; additions map to future hangar window/frame/shuttle/crane/beacon kits.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Added a panoramic rear hangar glass/haze depth layer.
- Added pressure frame and mullions to make the rear aperture architectural.
- Added docked shuttle silhouette as a bold scale cue.
- Added maintenance crane arms and joint beacon for hangar activity.
- Added runway recession strips, side dock shoulders, distant beacons, and a cyan reflected rim behind the command floor.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- The rear hangar remains primitive blockout; final depth would benefit from layered GLB silhouettes and better atmospheric treatment.
- If the shuttle or crane competes with the hero hologram, the next pass should dim/reposition rear accents rather than add detail.

Next visual fix:
- Public screenshot pass. If rear context reads, tune command-pit materials and table/glass reflections; if not, enlarge the aperture and simplify silhouettes.
