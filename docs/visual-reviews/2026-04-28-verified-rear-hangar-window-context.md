# Visual Review — 2026-04-28 verified rear hangar window context

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-rear-hangar-window-context.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-rear-hangar-window-1740.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: add a readable rear asteroid/hangar window context so the command floor feels carved into a larger base rather than staged against a flat back wall.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — panoramic blast window, mullion frame, exterior asteroid silhouettes, docked craft/gantry, rear balcony rail, and blue atmospheric backlight are future hangar-window kit pieces.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/asset-pipeline/playtest-fix pass. The deployed proof is current and visible; visual analysis says the biggest north-star gap is rear asteroid/window/hangar context and large-room depth, not more side props.
- web-game-foundations: render-only scene-structure change; no app state, route, input, navigation, data model, or DOM/HUD changes.
- three-webgl-game: preserve overview camera, fog, central holo-table hierarchy, ceiling oculus, side bays, and performance budgets. Add a subdued wide rear viewport/hangar opening with dark blue glass, thick mullions, exterior asteroid/craft silhouettes, rear rail/deck silhouettes, and soft cool backlight. Keep the window second-read behind the holo-table, avoid bright poster-flat backdrop, avoid loops/animation.
- web-3d-asset-pipeline: primitive blockout for modular rear-hangar kit: blast window frame, mullions, exterior rock silhouettes, docked craft, gantry/service arm, rear balcony rail, and atmospheric backlight plane. GLB/proxy replacement planned after composition proof.
- game-ui-frontend: not-applicable — no labels, HUD, menus, text overlays, or DOM UI are touched.
- game-playtest: captured post-change current-build screenshot via CDP, compared before/after against deployed proof and primary north-star for rear outside-world readability, depth/scale, holo-table preservation, lighting balance, no clutter regression, console health, and macro/performance gates.

Live proof before edit:
- Deployed HTML cache-bust before edit: `app.js?v=verified-ceiling-oculus-hub-frame-20260428`.
- Live app.js SHA matched repo app.js before edit: `4654b4e4e6539d62af757a5b7d8e802a3d10e6c8ba3beaaba6308c5c5767ba31`.
- Runtime markers found in deployed app.js: `buildVerifiedCeilingOculusHubFrame`, `verified ceiling oculus hub frame high perimeter armored ring`, `buildVerifiedSideBayRoleProps`, and `buildVerifiedSideOperatorBayReadability`.
- Direct CDP screenshot proof captured after browser-tool path was unreliable: `docs/visual-reviews/2026-04-28-live-proof-before-rear-hangar-window-1740.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — after adds clearer rear glass/frame/gantry definition and preserves the ceiling oculus, but the shell is still far simpler than the north-star asteroid chamber.
Station visibility: 2/5 — central hub remains clean; rear balcony/tiny silhouettes improve scale slightly, but stations still lack dense inhabited north-star readability.
Lighting/readability: 3/5 — holo-table hierarchy is preserved with added soft blue rear backlight; rear remains too dim/sparse versus the reference.
Depth/scale: 2/5 — rear window/deck/ship/star/moon cues add some depth, but the vista is still mostly abstract bands rather than a convincing exterior hangar.

Lighting/readability note:
- Initial rear-window placement was effectively invisible/occluded, so the pass was revised: moved after bay-wall passes, brought closer, brightened the blue glass/haze, added high-read exterior anchors, and kept the holo-table as the brightest focal point.

Game Studio checklist:
- pre-code skill application followed; revised after first visual comparison said the change was not honestly closer.
- three-webgl-game: overview camera/fog/table/ceiling/side bays preserved; render/material/light changes checked; no animation/procedural loops added.
- web-3d-asset-pipeline: rear viewport, mullions, exterior rocks, docked craft, balcony, runway lines, stars, and moon are named as modular hangar-window kit blockouts for future GLB replacement.
- game-playtest: deployed proof screenshot captured before runtime edits; local current-build screenshots captured after revisions; final visual comparison says honestly/marginally closer with no major clutter regression.

What moved closer:
- Rear wall now has more explicit hangar/window framing, blue glass, exterior ship/rock/star/moon cues, and a small rear balcony layer.
- Central holo-table and ceiling oculus hierarchy were preserved.

What is still off:
- The rear vista is still not materially north-star-level; it reads partly as abstract bands instead of an unmistakable asteroid/hangar exterior.
- The command room remains too sparse/diorama-like compared with the reference’s dense inhabited operational depth.

Next visual fix:
- Replace primitive rear-window blockout with one decisive GLB/proxy hangar-window composition or make the rear aperture much larger/cleaner with stronger exterior parallax and lighting separation.
