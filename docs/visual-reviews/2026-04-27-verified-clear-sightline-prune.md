# Visual Review — 2026-04-27 verified clear sightline prune

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-27-verified-clear-sightline-prune.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition
Skill focus: use deployed screenshot proof to clear the remaining dark horizontal bands crossing the central holo-table
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition pass. Deployed proof confirmed the latest occlusion-relief build is live, but screenshot review still showed dark bands slicing through the central holo-table and compressing the overview.
- web-game-foundations: Touch render-scene visibility/framing only. No mission state, navigation input, HUD, or DOM redesign planned beyond cache-bust.
- three-webgl-game: Keep lighting/fog/material systems stable. Add overview clear-sightline handling for named gantry/slab/sill occluders so the holo-table and operations ring are not crossed by opaque horizontal bands in the overview state.
- web-3d-asset-pipeline: No new kit/detail pass; this is primitive-blockout pruning/scale/visibility correction for existing gantry, apron, sill, and ceiling modules.
- game-ui-frontend: not-applicable — UI is not the issue; visual proof points at 3D occlusion.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot captured before commit; visual assessment says central holo-table sightline improved enough to count as closer, with upper band/exposure still needing follow-up.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The pass preserves the asteroid-base frame while removing over-dominant internal slats from overview.
Station visibility: 4/5 — Existing central table, ring, and stations are easier to read because several opaque gantry/apron bands are hidden in overview.
Lighting/readability: 4/5 — No lighting change; readability improves by preventing dark horizontal bands from crossing the focal core.
Depth/scale: 4/5 — The room remains layered, but the focal table is less blocked.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-occlusion-relief-20260427`.
- Live runtime markers found: `applyVerifiedOverviewOcclusionRelief`, `getCameraOffsetForMode`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-27-live-proof-before-second-occlusion-prune.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-27-verified-clear-sightline-prune.png`.
- Post-change image assessment: central holo-table sightline improved enough to count as closer; no critical regression; upper band and low exposure remain.

Lighting/readability note:
- No exposure/fog/light changes were made.
- Readability correction is screenshot-driven overview-only visibility/fade pruning, not added brightness.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added overview-only hidden list for full-width gantries, undersides, front apron, and rear apron.
- Added overview-only fade list for lower sill/shadow occluders.
- Preserved detail views by restoring base visibility/opacity outside overview.
- Updated cache-bust marker for deployment.

What is still off:
- A large upper horizontal structure still compresses the command table area.
- Overall exposure remains dark; side operators/work traffic are hard to read.

Next visual fix:
- Screenshot-driven upper-band relief plus selective side platform rim/fill, without adding new detail.
