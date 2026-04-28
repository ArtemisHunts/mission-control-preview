# Visual Review — 2026-04-27 asteroid inserted architecture contrast

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | lighting
Skill focus: make the room read as human-built operations architecture inserted into a carved asteroid shell
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused material/composition pass. Recent loops made the command pit richer; this pass restores asteroid-base specificity by contrasting matte rock collars with warmer inserted ops architecture.
- web-game-foundations: Touch render-scene structure only through a new asteroid/architecture contrast builder in `buildOffice()`; no state, input, navigation, HUD, or DOM behavior changes planned.
- three-webgl-game: Add broad matte rock cut faces, industrial retaining collars, rear aperture rock shoulders, and workstation pocket surrounds. Keep camera/fog/exposure stable; use large primitive forms only to avoid tiny detail spam.
- web-3d-asset-pipeline: Primitive-blockout for future modular GLB kits: rock cut collar, bay rock pocket, bronze retaining frame, hangar aperture shoulder, command pit retaining wall.
- game-ui-frontend: not-applicable — no DOM/UI changes; the environment must carry the material read.
- game-playtest: Run syntax, diff check, macro gate, marker grep, and local browser attempt; browser navigation was blocked, so public Pages visual verification is required.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Added interior rock cut faces/collars while preserving the asteroid as context rather than exterior clutter.
Station visibility: 4/5 — Station modules remain visible, now framed as warmer human inserts nested in rougher rock pockets.
Lighting/readability: 4/5 — Matte rock absorbs light, while bronze/cyan/amber retaining cues keep the command hierarchy readable.
Depth/scale: 4/5 — Rear aperture shoulders, workstation pockets, and command retaining masses add a stronger carved-base read.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: slightly more asteroid material inside the facility, still context/collar mass rather than dominant exterior subject.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: preserved; additions frame the existing interior architecture instead of replacing it.

Station visibility:
- Four station districts remain in place.
- Rock pockets and retaining rails should improve the “inserted module” read without hiding bay identities.

Lighting/readability note:
- No global exposure, fog, or camera change was made.
- Readability comes from material value separation: dark matte asteroid shell, warmer bronze retaining collars, and existing cyan command core.
- Local browser screenshot remains blocked by policy; public screenshot verification is needed to confirm the rock/architecture balance.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; broad primitives only, no procedural rock spam.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; additions map to future rock cut collar / retaining frame / pocket kit modules.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Added rear matte rock aperture shoulders, rough cut lintel/sill, and bronze retaining frame.
- Added side workstation rock pockets with retaining rails and restrained rim catches.
- Added command pit rock retaining masses and bronze lip to sell a human-built pit inserted into asteroid mass.
- Updated cache-bust marker for deploy.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- If rock collars crowd the room, the next pass should prune side pocket opacity/scale instead of adding more rock.

Next visual fix:
- Public screenshot pass. If the carved-in read works, tune operator suit identity; if not, simplify rock shoulders and keep only rear aperture collars.
