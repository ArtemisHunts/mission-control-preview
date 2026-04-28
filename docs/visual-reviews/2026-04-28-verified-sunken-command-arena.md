# Visual Review — 2026-04-28 verified sunken command arena

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-sunken-command-arena.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-command-hub-scale-1810.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: make the center read as a large sunken circular mission-control arena with bold concentric rings around the blue holo-globe, instead of a small flat table on a stage.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — outer walkway ring, inner pit fascia, tiered rim lights, radial stair/ramp cuts, and seated operator stations are future command-arena kit pieces.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/asset-pipeline/playtest-fix pass. Current visual proof shows the latest deployed runtime is reaching the scene; north-star comparison says the highest-leverage next step is central command hub scale/depth, not more rear-window bands.
- web-game-foundations: render-only scene structure change; no state, routes, input, navigation, data model, or DOM/HUD behavior changes.
- three-webgl-game: preserve overview camera, existing holo-globe/table, ceiling oculus, side bays, rear context, fog, and budgets. Add a wide open concentric command arena: dark recessed pit wall/fascia, outer walkway ring, inner amber/cyan edge rings, a few radial access breaks, and larger ring-side operator silhouettes. Keep center unobstructed and avoid covering the hologram.
- web-3d-asset-pipeline: primitive blockout for a modular command-arena kit: circular walkway tiers, pit fascia, rim-light strips, access stairs/ramps, guard rails, and ring operator station proxies. GLB/proxy replacement planned once composition is proven.
- game-ui-frontend: not-applicable — no labels, HUD, menus, text overlays, or DOM UI are touched.
- game-playtest: captured post-change current-build screenshot, compared before/after against deployed/local proof and primary north-star for sunken circular hub readability, table/globe hierarchy, operator-ring visibility, lighting balance, no ceiling/rear regression, console health, and macro/performance gates.

Live proof before edit:
- Deployed HTML cache-bust before edit: `app.js?v=verified-rear-hangar-window-context-20260428`.
- Live app.js SHA matched repo app.js before edit: `506c75c92f2c1cbeea8d2c443b3124a99c523316b625f1fb6202c317771831ef`.
- Runtime markers found in deployed app.js: `buildVerifiedRearHangarWindowContext`, `verified rear hangar window context distant blue moon outside glass`, `buildVerifiedCeilingOculusHubFrame`, and `buildVerifiedSideBayRoleProps`.
- New direct CDP deployed screenshot attempt failed with `Not attached to an active page`; headless Chrome local screenshot was SIGKILLed; existing active CDP current-build target then captured local current-build screenshot with canvas and `app.js?v=verified-rear-hangar-window-context-20260428`: `docs/visual-reviews/2026-04-28-live-proof-before-command-hub-scale-1810.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — shell/ceiling/rear context are preserved; the command hub now has a more architectural circular center, but the overall room is still flatter than the north-star.
Station visibility: 3/5 — larger ring-side operators/consoles make the mission-control use case more readable around the table.
Lighting/readability: 3/5 — central blue hierarchy remains strong with restrained cyan/amber ring edges; still needs richer warm practicals and workstation screen variety.
Depth/scale: 3/5 — recessed pit floor, outer lip, walkway ring, access cuts, and operator scale cues improve depth versus the previous flat-table read.

Lighting/readability note:
- Added a dark recessed floor/fascia and restrained cyan/amber rim rings so the pit reads without overpowering the holo-globe. The table/globe stays the brightest focal point.

Game Studio checklist:
- pre-code skill application followed; the pass stayed focused on command-arena scale/depth rather than more rear-window or side prop stacking.
- three-webgl-game: overview camera/fog/table/ceiling/rear context preserved; render/material/light additions checked; no animation/procedural loops added.
- web-3d-asset-pipeline: circular tiers, pit lip, rim strips, access breaks, and ring operators are named as modular command-arena kit blockouts for future GLB/proxy replacement.
- game-playtest: pre-edit proof and post-edit screenshots captured; visual comparison says honestly closer with +1 station visibility and +1 depth/scale, no major clutter regression.

What moved closer:
- The center now reads more like a large sunken circular operations arena, not just a flat console island.
- Operators/consoles around the ring are more visible at overview scale while preserving the central holo-table hierarchy.

What is still off:
- The room still lacks north-star-level dense material richness and warm practical lighting.
- Rear/exterior context and ceiling architecture still need stronger, cleaner high-fidelity composition.

Next visual fix:
- Upgrade the command-arena kit from primitive rings into stronger architectural GLB/proxy geometry: stepped pit walls, proper railings, stair cuts, and richer ring-side workstation modules.
