# Visual Review — 2026-04-28 verified rear hangar depth

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-rear-hangar-depth.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | lighting
Skill focus: use deployed screenshot proof to separate the rear hangar/background volume behind the command pit while preserving the holo-table as hero
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition-lighting pass. Deployed proof confirms the upper-band/platform build is live; screenshot review says center table, upper band, and side platforms now read, but the rear zone still flattens into a dark scenic wall.
- web-game-foundations: Touch scene construction/readability only. No mission state, input behavior, navigation model, HUD, or DOM copy change beyond cache-bust.
- three-webgl-game: Keep camera/base exposure/fog stable. Add bounded rear hangar depth layers: recessed aperture, cool haze/value planes, small craft/cargo silhouettes, receding runway seams, and tiny maintenance lights. Performance risk is small: fixed primitive meshes, no animation-loop additions.
- web-3d-asset-pipeline: Primitive-blockout modular kit stance: hangar bay aperture, docking lane, utility craft/cargo pods, crane/gantry rails, and maintenance beacon kit. GLB not introduced; these are placeholders for future asset modules.
- game-ui-frontend: not-applicable — the problem is 3D rear-depth readability, not DOM/UI.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot shows foreground command pit, mid operations deck, and background hangar reading as stronger layers; central holo-table remains brightest; no critical regression.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid-base frame holds while the rear aperture feels more like a working hangar volume.
Station visibility: 4/5 — Existing station/side reads hold; no obvious regression to the operations floor.
Lighting/readability: 4/5 — Selective cool haze and tiny amber/cyan work lights separate depth without global brightening.
Depth/scale: 4/5 — Foreground/midground/background layering behind the command pit is stronger.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-upper-band-platforms-20260427`.
- Live runtime markers found: `buildVerifiedUpperBandSidePlatformReadability`, `updateOverviewClearSightline`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-28-live-proof-before-rear-depth.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-28-verified-rear-hangar-depth.png`.
- Post-change image assessment: honestly closer; rear hangar reads more clearly as a separate layer; command pit remains anchored in front; no critical regression.

Lighting/readability note:
- No global exposure/fog lift was made.
- Readability comes from controlled rear value separation, rim strips, runway seams, low-contrast silhouettes, and tiny maintenance lights while keeping the holo-table as the strongest glow.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added a recessed rear blue-glass/haze volume, aperture rims, and mid occlusion catwalk shadow.
- Added receding runway strips, parked utility craft/cargo silhouettes, docking rails, and tiny maintenance lights as scale cues.
- Preserved central holo-table dominance and the improved side/upper reads.
- Updated cache-bust marker for deployment.

What is still off:
- Rear hangar remains dark and can still read as a broad slab at first glance.
- Background craft and bay details are primitive-blockout, not premium asset quality yet.

Next visual fix:
- Add a subtle final rear rim/atmospheric separation pass or start converting the most important primitives into cleaner modular GLB-style kits.
