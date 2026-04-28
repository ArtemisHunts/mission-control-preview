# Visual Review — 2026-04-27 verified occlusion relief

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-27-verified-occlusion-relief.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition
Skill focus: use deployed screenshot proof to reduce foreground/ceiling horizontal occlusion bands so the command room occupies more of the overview
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition pass. Deployed proof showed latest code is live, but the current overview still reads like the command room is viewed through large dark horizontal slats.
- web-game-foundations: Touch render/camera composition only. No mission state, navigation model, input behavior, or HUD redesign planned beyond cache-bust.
- three-webgl-game: Keep lighting/fog/material systems stable. Apply targeted relief to named occluding ceiling/foreground sill meshes and slightly tighten overview camera distance so the central command table and station ring occupy more screen height.
- web-3d-asset-pipeline: No new kit/detail pass; this is primitive-blockout pruning/scale correction for existing ceiling slab, asteroid sill, shadow reveal, and command sill modules.
- game-ui-frontend: not-applicable — UI is not the issue; visual proof points at 3D occlusion/framing.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot captured before commit; image assessment said the pass is legitimately closer, though occlusion remains.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Relief preserves asteroid/cutaway context while reducing slat-like occlusion.
Station visibility: 4/5 — Existing central table, ring, stations, and rear context are more readable in the post-change screenshot.
Lighting/readability: 4/5 — No lighting change; readability improved by reducing dark horizontal bands crossing the visual path.
Depth/scale: 4/5 — The overview still reads as a large base, but less like an accidental crop through vents.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-overview-framing-20260427`.
- Live runtime markers found: `getCameraOffsetForMode`, `buildAsteroidInsertedArchitectureContrast`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-27-live-proof-before-occlusion-prune.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-27-verified-occlusion-relief.png`.
- Post-change image assessment: legitimate closer pass; central holo-table more readable; dark bands still remain.

Lighting/readability note:
- No exposure/fog/light changes were made.
- Readability correction was driven by captured screenshot evidence: reduce dark horizontal occluders and tighten overview framing.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Reduced/raised/scaled named heavy ceiling slabs, foreground sill, shadow reveal, command sill, and ceiling vignette baffles.
- Tightened overview camera from the prior far pullback so the command room occupies more screen height.
- Preserved the verified deployment/proof workflow instead of blind geometry stacking.

What is still off:
- Large dark horizontal bands remain across the upper/mid frame.
- Top third still has too much dark dead space relative to the interesting command floor.

Next visual fix:
- Screenshot-driven second occlusion prune: further raise/thin the remaining major bands and give the central holo-table more vertical breathing room.
