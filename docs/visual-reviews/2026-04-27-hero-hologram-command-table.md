# Visual Review — 2026-04-27 hero hologram command table

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting
Skill focus: make the blue holographic globe/table the dominant north-star hero object
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused composition/lighting pass. Previous loop added the operations ring/ceiling oculus; this pass routes through the same stack to strengthen the central mission-table hero read.
- web-game-foundations: Touch render-scene structure only in the `buildOffice()` scene assembly; no state, input, nav, HUD, or DOM behavior changes.
- three-webgl-game: Add a larger layered cyan hologram system above the existing circular table: brighter globe, scan column, orbit paths, tactical rings, route bars, node markers, and cyan spill strips. Keep camera/fog stable and avoid new decorative loops or exterior clutter.
- web-3d-asset-pipeline: Primitive-blockout for future modular GLB kits: holographic globe kit, projection-ring kit, scan-column kit, tactical-node kit, and table-emitter kit.
- game-ui-frontend: not-applicable — no HUD/labels/menus changed; in-world hologram must carry the read.
- game-playtest: Run module syntax, diff check, macro gate, marker checks; attempt local browser screenshot if policy allows, otherwise record blocker and require public Pages screenshot verification.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid remains a border/proscenium only. The pass adds no exterior rock, comet, deck-ring, or hangar clutter.
Station visibility: 4/5 — Surrounding stations and console ring remain intact. The stronger center should clarify why operators/consoles are arranged around the table.
Lighting/readability: 4/5 — Added controlled cyan hero lighting: larger globe opacity/intensity, scan column, tactical rings, node markers, console spill edges, and one restrained point light.
Depth/scale: 4/5 — The scan column and larger suspended globe connect table to ceiling oculus vertically, closer to the north-star board’s command-column silhouette.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: unchanged around ~17–22%; all edits are inside the command hub.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~78–84%. The central command table now carries more of the first read without expanding exterior context.

Station visibility:
- Four station districts remain active and visible.
- Existing operators remain; this pass makes their relationship to the central tactical table more legible.

Lighting/readability note:
- No global exposure increase was made.
- Cyan spill is localized to the table/globe/console edge system so it does not flatten the whole room into neon wash.
- Actual pixel balance still needs public screenshot verification because local browser navigation is blocked.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; no new procedural rock/marker loops.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; additions map to future hologram globe, scan-column, table emitter, tactical node, and projection-ring kits.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Enlarged and brightened the blue floating mission globe.
- Added soft vertical scan column from table to globe.
- Added three orbit paths around the globe.
- Added tabletop cyan/amber tactical projection rings and central emitter.
- Added mission nodes, route segments, cyan spill pool, console spill edges, and a restrained cyan point light.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- Hologram remains primitive blockout, not final volumetric/glass shader work.
- Operator gestures around the table are still minimal and should come after the hero read is verified.

Next visual fix:
- Public screenshot pass. If the table/globe now reads as the hero, add 3–5 human-scale interaction silhouettes around it; if not, tune table/globe scale and cyan intensity first.
