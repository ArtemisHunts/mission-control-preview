# Visual Review — 2026-04-28 verified outer bay activity readability

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-outer-bay-activity-readability.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-outer-stations-1240.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: outer station/bay activity readability while preserving the central holo-globe as the first read.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — treating bay light rails, console islands, operator silhouettes, carts, cargo sleds, and robotic arm silhouettes as future modular station kits.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/playtest-fix pass because the deployed screenshot proves the scene loads and the center improved, but the outer bays still read as dark mass rather than an active operations floor.
- web-game-foundations: render-only scene structure; no app state, navigation, click/input, or DOM readout changes.
- three-webgl-game: preserve the overview camera and central holo-table hierarchy; add broad readable side-bay light floors, console/activity silhouettes, small operators, cargo/drones, and rim lights; avoid dense tiny noise and keep mesh additions controlled.
- web-3d-asset-pipeline: approximate modular outer-bay activity kits: station console cluster, operator anchor, cargo cart/sled, robotic arm silhouette, bay plaque, runway/hazard line; primitive blockout now with GLB-ready naming and scale.
- game-ui-frontend: not-applicable — no HUD/menu/DOM text changes; any bay identity is in-world geometry only.
- game-playtest: captured local/current-build screenshot through direct CDP after the edit, compared against deployed proof for outer station readability/no clutter regression/table still hero, ran syntax/diff/macro gates, and committed only because the verdict was honestly closer.

Live proof before edit:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-holo-globe-command-scale-20260428`.
- Live app.js SHA matched repo app.js before edit: `aec0bb33bb01cf31b57371546fd944ae1798e1db7a66ee4f047ad79d9f58d7a9`.
- Recent runtime markers found in deployed app.js: `buildVerifiedHoloGlobeCommandScale`, `verified holo globe command scale`, `buildVerifiedRearPanoramaCeilingStrips`, and `verified rear panorama`.
- Screenshot proof captured from the deployed page via direct CDP `Page.captureScreenshot`: `docs/visual-reviews/2026-04-28-live-proof-before-outer-stations-1240.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — outer bays now read as more populated work zones inside the existing cutaway shell, though the physical asteroid/window context still needs a stronger pass.
Station visibility: 3/5 — side/rear bays gained visible workpools, console panels, operator silhouettes, cargo carts, robotic arms, and bay status walls; operators remain small at the default camera.
Lighting/readability: 3/5 — warm/cool bay pools and status strips lift the side structures while keeping the central holo-table dominant; further glow would risk noisy neon.
Depth/scale: 4/5 — bay activity anchors help the facility feel larger and more operational, with central-to-outer depth better layered than before.

Lighting/readability note:
- Added restrained warm/cool point fills for all four outer bays, broader glowing workpool floors, rear console rails, status wall glows, task queue bars, and operator/cargo rim cues. The center remains the brightest focal object.

Game Studio checklist:
- pre-code skill application followed; no UI/input drift.
- three-webgl-game: overview camera preserved, render/material/light changes checked, primitive mesh count remains under gate budget.
- web-3d-asset-pipeline: outer-bay activity kits are named as modular GLB-ready blockout parts.
- game-playtest: deployed proof screenshot captured before code; local post-change screenshot captured after code; visual comparison says closer, with mild noise risk but no central holo-table regression.

What moved closer:
- The outer bays now feel more staffed and operational instead of reading as mostly dark architectural mass.
- Console panels, cargo carts, robotic arm silhouettes, bay status walls, and colored workpools create clearer active-production read around the command hub.

What is still off:
- Operators are still small at default camera distance.
- Rear/window asteroid context remains abstract, and added colored glows should not be pushed much further without better material/form detail.

Next visual fix:
- Use fewer but larger readable outer-bay workstation silhouettes or make the rear window show unmistakable ship/asteroid forms; avoid simply adding more tiny glowing markers.
