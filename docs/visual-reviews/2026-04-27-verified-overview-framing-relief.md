# Visual Review — 2026-04-27 verified overview framing relief

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-27-verified-overview-framing-relief.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition
Skill focus: verified deployed scene is current, then fixed overview camera/framing so the built scene reads instead of being squeezed by horizontal massing
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition pass. Deployed HTML loaded `app.js?v=asteroid-inserted-architecture-20260427`, and live app.js contained recent runtime markers. Screenshot proof showed recent geometry is reaching the scene, but the overview was under-framed and occluded by large horizontal masses.
- web-game-foundations: Touch camera/render framing behavior only. No input model, HUD logic, mission state, or DOM panels planned beyond cache-bust.
- three-webgl-game: Replace one fixed camera offset with mode-aware overview/detail offsets and portrait viewport relief. Pull overview higher/farther back, lower the overview target slightly, and preserve existing lighting/fog/materials.
- web-3d-asset-pipeline: not adding new asset kits; this is a framing/playtest correction so existing primitive-blockout assets can be validated visually.
- game-ui-frontend: not-applicable — no HUD redesign; only app cache-bust changes if runtime changes ship.
- game-playtest: Captured deployed proof via CDP screenshot, ran syntax/diff/macro gate, then captured post-change local proof screenshot before commit.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Framing now reveals more of the carved container rather than adding more shell mass.
Station visibility: 4/5 — The post-change screenshot makes the central control area, circular platform, and surrounding structure more readable.
Lighting/readability: 4/5 — No lighting change; readability improved through camera value hierarchy and less apparent occlusion.
Depth/scale: 4/5 — Higher/farther overview shows more of the full base footprint and rear context.

Visual proof:
- Deployed HTML cache-bust found: `app.js?v=asteroid-inserted-architecture-20260427`.
- Live runtime markers found: `buildAsteroidInsertedArchitectureContrast`, `buildCommandPitMaterialContrast`, `buildCommandPitLightingHierarchy`, `buildRearHangarWindowScaleContext`.
- Browser tool screenshot failed once with gateway timeout.
- CDP screenshot succeeded for deployed proof: `docs/visual-reviews/2026-04-27-live-proof-before-next-pass.png`.
- CDP screenshot succeeded after local change: `docs/visual-reviews/2026-04-27-verified-overview-framing-relief.png`.

Lighting/readability note:
- No exposure/fog/light/material changes were made.
- Readability correction is camera/framing, based on screenshot proof rather than grep-only confidence.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed screenshot captured before edits; post-change screenshot captured before commit.

What moved closer:
- Proved current deployed scene is loading recent runtime code.
- Added mode-aware camera offsets instead of one fixed offset for all views.
- Pulled overview higher/farther back and added portrait viewport relief.
- Lowered overview target slightly so the central command floor sits more clearly in frame.

What is still off:
- Dark horizontal bands still exist; the scene is improved but not fully open/readable.
- A follow-up should prune or scale true occluding geometry only after another screenshot confirms which forms are causing it.

Next visual fix:
- Screenshot-driven occlusion prune: identify and reduce the top/bottom slabs that still letterbox the operations floor.
