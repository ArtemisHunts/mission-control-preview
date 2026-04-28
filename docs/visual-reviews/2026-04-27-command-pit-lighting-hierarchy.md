# Visual Review — 2026-04-27 command pit lighting hierarchy

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: lighting | composition
Skill focus: make the command pit/table the first read by adding warm pit bounce, cyan haze, and restrained rear/ceiling vignette forms
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused lighting/composition pass. The scene has enough assets; this pass tightens value hierarchy so the central table, crew, consoles, then rear hangar read in that order.
- web-game-foundations: Touch render-scene structure only via a new lighting hierarchy builder in `buildOffice()`; no state, input, navigation, HUD, or DOM behavior changes planned.
- three-webgl-game: Add broad low-cost light planes and shadow baffles: warm under-table/pit bounce, cyan volumetric haze around the hologram, subtle crew rim strips, and dim rear/ceiling vignette masks. Keep camera/fog/exposure stable and use primitives only.
- web-3d-asset-pipeline: Primitive-blockout for future modular kits: pit underlight, glass reflection plane, volumetric haze card, ceiling corner baffle, rear contrast damper.
- game-ui-frontend: not-applicable — no UI/DOM overlays; visual hierarchy must come from scene lighting.
- game-playtest: Run module syntax, diff check, macro gate, marker grep, and local browser attempt; browser navigation was blocked, so public Pages visual verification is required.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid proscenium unchanged; all work is interior value hierarchy.
Station visibility: 4/5 — Peripheral dim veils keep stations present but less equal-bright against the central table.
Lighting/readability: 4/5 — Warm under-table bounce, cyan haze/backplate, crew rim strips, ceiling vignettes, and rear contrast dampers improve first-read hierarchy.
Depth/scale: 4/5 — Rear hangar is kept secondary while cyan depth cue remains, separating command pit from backdrop.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: unchanged around ~17–22%; no rock/exterior mass changed.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~79–84%; additions are interior lighting/value planes.

Station visibility:
- Four station districts remain in place.
- New dim veils should reduce screen/strip competition and keep the command pit as the focal hierarchy winner.

Lighting/readability note:
- No global exposure, fog, or camera change was made.
- Readability improvement comes from central warm/cyan light shaping, crew rim strips, rear dampers, and ceiling vignette baffles.
- Local browser screenshot remains blocked by policy; public screenshot verification is needed to confirm the value hierarchy actually reads.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; broad primitives only, no new loops counted by macro gate.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; additions map to future lighting-card/baffle/underlight kits.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Added warm under-table/pit bounce pool.
- Added cyan hologram atmosphere veil and soft backplate.
- Added crew/console rim strips and floor bounce accents.
- Added peripheral station dim veils, rear contrast dampers, and ceiling corner vignette baffles.
- Updated cache-bust marker for deployment.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- If the transparent baffles sort awkwardly, the next pass should replace them with material intensity tuning instead of adding more planes.

Next visual fix:
- Public screenshot pass. If hierarchy reads, refine command-pit materials; if it muddies, prune/dim transparent baffles and tune emissive values directly.
