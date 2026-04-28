# Visual Review — 2026-04-28 verified rear window ship silhouette

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-rear-window-ship-silhouette.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-rear-window-ships-1310.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: make the rear hangar/window context unmistakable with fewer larger ship/asteroid silhouettes while keeping the central holo-table dominant.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — treating rear ship silhouette, asteroid cavern shoulders, docking ribs, and window glow as a future modular hangar backdrop kit.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/playtest-fix pass because the deployed proof shows the scene is current, but the north-star asteroid/hangar context is still too abstract in the rear band.
- web-game-foundations: render-only scene structure; no app state, navigation, click/input, or DOM readout changes.
- three-webgl-game: preserve the overview camera and central holo-table hierarchy; add broad readable rear window silhouettes, docked ship mass, asteroid wall shoulders, docking ribs, and soft blue window spill; avoid many tiny star/marker meshes.
- web-3d-asset-pipeline: approximate a modular rear hangar backdrop kit: panoramic glass, docked ship body/wings/engine, cavern rock shoulders, docking bay ribs, runway/horizon lines; primitive blockout now, GLB-ready naming/scale later.
- game-ui-frontend: not-applicable — no HUD, labels, menus, or DOM overlays change.
- game-playtest: captured local/current-build screenshot through direct CDP after the edit, compared against deployed proof for rear context readability/no center regression/no noisy marker buildup, ran syntax/diff/macro gates, and committed only because the verdict was honestly closer.

Live proof before edit:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-outer-bay-activity-20260428`.
- Live app.js SHA matched repo app.js before edit: `a4a43b3540455ff38346a781f31b96beb9cea47b01d27948537cd5ad6d309fb2`.
- Recent runtime markers found in deployed app.js: `buildVerifiedOuterBayActivityReadability`, `verified outer bay activity`, `buildVerifiedHoloGlobeCommandScale`, and `verified holo globe command scale`.
- Screenshot proof captured from the deployed page via direct CDP `Page.captureScreenshot`: `docs/visual-reviews/2026-04-28-live-proof-before-rear-window-ships-1310.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — the rear window now has a stronger hangar/cavern silhouette cue inside the existing cutaway shell, though the asteroid context is still understated.
Station visibility: 3/5 — central and outer stations remain readable; this pass did not materially change workstation visibility.
Lighting/readability: 4/5 — rear blue glass/haze and ship-edge cues improve the back wall without stealing the holo-table’s hierarchy.
Depth/scale: 3/5 — the larger docked hauler, runway lines, cavern shoulders, and docking ribs add depth cues, but the hangar still needs more unmistakable exterior scale.

Lighting/readability note:
- Added a broader cool glass lift, exterior haze, dark docked ship mass, cyan/amber engine/cockpit cues, runway lines, cavern rock shoulders, docking ribs, and a restrained rear blue point fill. The central holo-table remains the brightest focal object.

Game Studio checklist:
- pre-code skill application followed; no UI/input drift.
- three-webgl-game: overview camera preserved, render/material/light changes checked, primitive mesh count remains under gate budget.
- web-3d-asset-pipeline: rear hangar/window kit pieces are named as modular GLB-ready blockout parts.
- game-playtest: deployed proof screenshot captured before code; local post-change screenshot captured after code; visual comparison says closer but marginal, with no central holo-table regression.

What moved closer:
- The rear band reads more like an exterior asteroid hangar/window layer instead of a flat dark backdrop.
- The large docked hauler silhouette and cavern shoulders add context without adding noisy micro-markers.

What is still off:
- Asteroid-base exterior is still understated and not yet a fully convincing hangar vista.
- More ship/rock form detail should be larger and fewer, not extra tiny lights.

Next visual fix:
- Add one or two larger, unmistakable asteroid/ship forms or move toward real GLB/proxy hangar modules; avoid more small glowing clutter.
