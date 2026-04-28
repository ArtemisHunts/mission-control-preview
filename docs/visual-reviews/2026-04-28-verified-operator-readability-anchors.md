# Visual Review — 2026-04-28 verified operator readability anchors

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-operator-readability-anchors.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | asset-pipeline
Skill focus: use deployed screenshot proof to promote six readable operator anchors around the central mission ring without crowding the established composition
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition pass. Deployed proof confirms the operator-workstation build is live; screenshot review says workstation activity improved but operators remain too small/dark/abstract at default view.
- web-game-foundations: Touch scene construction/readability only. No state, input, navigation, HUD, or DOM copy changes beyond cache-bust.
- three-webgl-game: Keep camera, fog, base exposure, and holo-table lighting stable. Add six larger, readable human-scale anchors around the central ring with dark bodies, cyan/amber rim/visor highlights, contact shadows, and paired workstation panels. Performance risk is small: fixed primitive meshes; no new animation loops beyond existing operator bob list.
- web-3d-asset-pipeline: Primitive-blockout modular kit stance: hero operator silhouette kit plus workstation panel/contact-shadow kit. GLB not introduced; these are future character/console module placeholders.
- game-ui-frontend: not-applicable — this is 3D character readability, not DOM/UI.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot shows 4–6 operators read better at a glance, central holo-table remains hero, and no crowd/clutter regression appears.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The container and facility framing are preserved; pass only adds human-scale anchors.
Station visibility: 4/5 — Central ring and adjacent consoles now read as staffed work positions.
Lighting/readability: 4/5 — Local rim/visor/panel highlights improve people-read without global brightening.
Depth/scale: 4/5 — Six stronger figures improve scale cues around the central pit.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-operator-workstations-20260428`.
- Live runtime markers found: `buildVerifiedOperatorWorkstationActivity`, `buildVerifiedRearHangarDepthSeparation`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-28-live-proof-before-operator-readability.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-28-verified-operator-readability-anchors.png`.
- Post-change image assessment: closer; 4–6 operators around the ring are more readable human-scale anchors; no critical regression or clutter; rear figures still weaker and some silhouettes blend into dark console geometry.

Lighting/readability note:
- No global exposure/fog/light change was made.
- Readability comes from larger silhouettes, cyan/amber rim bars, visor/headset glows, contact shadows, and paired workstation panels.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added six larger central-ring operator anchors with readable torso/head/arm shapes.
- Added visor, chest, rim, contact-shadow, and paired workstation panel cues so operators read as staff, not props.
- Preserved central holo-table dominance and avoided crowding the scene.
- Updated cache-bust marker for deployment.

What is still off:
- Rear operator anchors remain weaker than the front/mid figures.
- Some figures still blend into dark console/ring geometry at screenshot scale.

Next visual fix:
- Add slightly brighter helmet/rim highlights to the weakest rear figures, or begin replacing the central operator/console primitives with cleaner modular character-console kits.
