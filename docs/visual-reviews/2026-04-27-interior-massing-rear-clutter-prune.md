# Visual Review — 2026-04-27 interior massing rear clutter prune

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | performance
Skill focus: prune duplicated border/rear clutter and make the engineered interior mass read larger than the asteroid
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Use the moodboard hierarchy — dark rocky perimeter, large manufactured command floor, readable central hub, broad bay architecture.
- web-game-foundations: Keep the single-module page lightweight; no new assets, fetches, or UI surfaces.
- three-webgl-game: Favor fewer large meshes, tighter camera/fog, lower transparent overlap, and no decorative marker loops.
- web-3d-asset-pipeline: Treat new forms as modular blockout proxies for later GLB wall/gantry/bay kits.
- game-ui-frontend: not-applicable — no HUD/UI change needed for this macro pass.
- game-playtest: Local browser screenshot remains blocked by policy; gate and code-level composition checks used, public page verification still required.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid is preserved as the calibrated side/crown/sill proscenium. Duplicate target-reset asteroid shoulders/crown/sill were removed, so the rock is less likely to become the subject.
Station visibility: 4/5 — Build, Review, Observatory, and Deploy keep labels, operators, bay frames, and accent rails. New broad mezzanines and dark equipment walls make them read as production bays, not little kiosks.
Lighting/readability: 4/5 — Removed redundant rear instrumentation/depth layers and exterior ship silhouettes that competed with the first read. The hotfix witness lights remain, but the scene now exposes cleaner interior masses and fewer rear overlaps.
Depth/scale: 4/5 — Depth is now carried by larger forms: rear integrated factory wall, operations slot, inner pressure jambs, side machine slabs, full-width gantries, command floor blocks, and station mezzanines.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: ~17–22%. This pass removes a second asteroid shoulder/crown/sill layer and keeps only the calibrated proscenium as the active border.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~78–83%. The camera/fog tightened slightly, and the active frame gained interior pressure jambs, bay mezzanines, command massing, side machinery, and gantries.

Station visibility:
- All four stations remain active and clickable through room meshes.
- Operators remain visible as simplified scale figures.
- Role colors remain on broad rails/headers instead of scattered tiny beacons.

Lighting/readability note:
- No exposure increase was made; after the blank-page/black-crush fixes, more light is not the main problem.
- Readability was improved by reducing redundant rear geometry and replacing thin/decorative layers with broad massing.
- Existing broad hotfix lights remain to avoid regressing to a blank-looking first frame.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/fog, active call chain, mesh-constructor count, loop markers, and module syntax checked.
- web-3d-asset-pipeline: new pieces are GLB-ready modular primitives: pressure jambs, lintel, bay mezzanines, equipment walls, gantries, and side machinery slabs.
- game-playtest: local screenshot/readability check attempted path is blocked by browser policy; blocker recorded.

Depth/scale:
- The scene now reads more like a production room inserted behind an asteroid aperture.
- Rear depth is a factory wall/slot, not small exterior ships or extra rear deck clutter.

FPS/performance risk:
- Lower/flat. Removed active `buildWindowWall()` and `buildDistantFacilityDepth()` bodies/calls plus duplicate target asteroid pieces and exterior ship silhouettes.
- Added broad interior massing, but stayed under budgets and kept loop markers at zero.
- App remains compact at gate time.

Screenshot/capture note:
- Local browser screenshot capture is blocked in this worker path.
- This review is based on code-level composition against the reference boards and spec; public screenshot verification remains mandatory before adding detail.

What moved closer:
- Asteroid border is simpler and less dominant.
- Interior command/production floor has stronger engineered mass.
- Four station districts read as larger bays through mezzanines/equipment walls.
- Rear view is less exterior-ship/set-dressing and more factory wall/depth.
- Active redundant rear clutter was pruned.

What is still off:
- Needs actual pixel verification on GitHub Pages.
- Material contrast around the new massing may need tuning once visible.
- Do not add more station micro-props until the broad composition is proven.

Next visual fix:
- Public screenshot pass. If the composition finally reads right, tune material contrast and labels; if not, remove remaining old shell overlaps before adding anything new.
