# Visual Review — 2026-04-28 verified ceiling oculus hub frame

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-ceiling-oculus-hub-frame.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-ceiling-ribs-1710.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: strengthen the north-star overhead read with a bold ceiling oculus/rib frame and practical strips that point the eye back to the circular command hub, without stacking more side props.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — overhead oculus ring, radial trusses, underside practical strips, and hub canopy ribs are future ceiling-kit GLB pieces.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/asset-pipeline pass routed through web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest. The current proof shows the latest deployed runtime is present, but the overview still reads too flat/dollhouse versus the enclosed north-star operations room.
- web-game-foundations: render-only scene structure change; no state, input, navigation, data model, or DOM/HUD behavior changes.
- three-webgl-game: preserve current overview camera, fog, central holo-table, rear bay wall, and side operator bays; add a high-contrast overhead oculus/canopy around the hub with radial ribs and warm/cyan practical strips. Keep materials dark graphite/steel, lights restrained, no animation, no procedural loops, and avoid blocking the holo-globe.
- web-3d-asset-pipeline: primitive blockout for a modular ceiling architecture kit: oculus ring segments, radial trusses, service spines, practical light strips, and future GLB canopy modules.
- game-ui-frontend: not-applicable — no HUD, labels, menus, text overlays, or DOM UI are touched.
- game-playtest: captured post-change screenshot via direct CDP/local current build, compared before/after against the deployed proof and north-star for ceiling-rib readability, hub hierarchy, warm/cool contrast, no central occlusion, no console errors, and performance/mesh-budget gate.

Live proof before edit:
- Deployed HTML cache-bust before edit: `app.js?v=verified-side-bay-role-props-20260428`.
- Live app.js SHA matched repo app.js before edit: `8f6a65ffff4173027c546919d7aa111d711766396af981efea154db8578e9197`.
- Runtime markers found in deployed app.js: `buildVerifiedSideBayRoleProps`, `verified side bay role props readable left fabrication vertical robot mast`, `buildVerifiedSideOperatorBayReadability`, and `buildVerifiedBayWallRimReadability`.
- Browser screenshot tool timed out, then direct CDP `Page.captureScreenshot` succeeded: `docs/visual-reviews/2026-04-28-live-proof-before-ceiling-ribs-1710.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — after adds clearer overhead rib/oculus framing and better enclosed-room structure, but the shell is still too flat versus the north-star asteroid chamber.
Station visibility: 2/5 — circular hub remains visible and mostly unobstructed, but side workstations/operators are still abstract at wide scale.
Lighting/readability: 2/5 — cool central glow and restrained warm/cyan practicals are present, but room practicals still lack the rich layered readability of the reference.
Depth/scale: 2/5 — overhead frame improves layering slightly; rear asteroid/window context and large-room depth remain weak.

Lighting/readability note:
- Added dark graphite/steel overhead ring/raked ribs with thin cyan and amber practical strips plus low-intensity overhead point lights. First screenshot variant made the center feel too crowded, so the frame was revised higher/wider/open-center before final screenshot.

Game Studio checklist:
- pre-code skill application followed; implementation was revised after first screenshot because the ceiling frame competed with the holo-table.
- three-webgl-game: overview camera/fog/table/rear bay preserved; render/material/light changes checked; no animation/procedural loops added.
- web-3d-asset-pipeline: ceiling oculus/rib/practical elements named as modular ceiling-kit blockouts for future GLB replacement.
- game-playtest: deployed proof captured before runtime edits; local current-build screenshot captured after revisions; final visual comparison says honestly/marginally closer with no major clutter regression.

What moved closer:
- The top of the frame now reads more like a deliberate operations-room ceiling with an oculus/rib structure framing the command hub.
- Warm/cool practical strips now reinforce the command hierarchy instead of adding more side prop clutter.

What is still off:
- The scene still lacks convincing rear asteroid/window context and cavernous facility depth.
- Side stations/operators remain too primitive and abstract compared with the north-star command floor.

Next visual fix:
- Rear asteroid/hangar window context and depth pass: make the back wall read as a real view into space/asteroid infrastructure, not a flat stage backdrop.
