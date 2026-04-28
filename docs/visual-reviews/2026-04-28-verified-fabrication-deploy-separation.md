# Visual Review — 2026-04-28 verified fabrication deploy separation

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-fabrication-deploy-separation.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | lighting
Skill focus: use deployed screenshot proof to make the rear fabrication/deploy infrastructure read as an active support layer without changing the central command focus
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition-lighting pass. Deployed proof confirms the operator-rim build is live; screenshot review says the command ring and staffed center now read, but the rear fabrication/deploy layer still falls into a dark mass.
- web-game-foundations: Touch scene construction/readability only. No state, input, navigation, HUD, or DOM copy changes beyond cache-bust.
- three-webgl-game: Keep camera, fog, global exposure, and holo-table lighting stable. Add selective guide-light lanes, rear/side bay rim strips, cargo sled/module silhouettes, and gantry/catwalk edge highlights. Performance risk is small: fixed primitive meshes, no new animation loops.
- web-3d-asset-pipeline: Primitive-blockout modular kit stance: fabrication/deploy lane kit, cargo sled kit, bay-rim/catwalk highlight kit. GLB not introduced; these are placeholders for future industrial asset modules.
- game-ui-frontend: not-applicable — this is 3D infrastructure readability, not DOM/UI.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot shows the back half reads more like active fabrication/deploy infrastructure, operators remain foreground scale anchors, and the central holo-table stays hero.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid container and interior production facility structure are preserved.
Station visibility: 4/5 — Guide lanes and bay rims clarify how side/rear work zones connect to the command core.
Lighting/readability: 4/5 — Local rim and lane highlights improve the rear layer without broad brightening.
Depth/scale: 4/5 — Cargo sleds and receding lane strips add scale/function behind the staffed ring.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-operator-rim-separation-20260428`.
- Live runtime markers found: `buildVerifiedOperatorRimSeparation`, `buildVerifiedOperatorReadabilityAnchors`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-28-live-proof-before-character-console-kit.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-28-verified-fabrication-deploy-separation.png`.
- Post-change image assessment: honestly closer; rear fabrication/deploy separation improved, guide lanes and sled/equipment details are visible, bay/catwalk edge accents help, central holo-table remains hero; no critical regression.

Lighting/readability note:
- No global exposure/fog/light change was made.
- Readability comes from restrained cyan/amber/green guide strips, bay door rims, catwalk edge highlights, and small cargo/module silhouettes.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added command-core-to-bay guide-light lanes for fabrication, deploy, and rear assembly flow.
- Added bay/catwalk rim highlights and three small cargo/module sled silhouettes to show active logistics.
- Preserved operator and central holo-table hierarchy.
- Updated cache-bust marker for deployment.

What is still off:
- Rear infrastructure remains dark/compressed, especially the upper/back fabrication shelf.
- Distinction between fabrication line and deploy infrastructure is still mostly implied by color/position, not clean asset identity.

Next visual fix:
- Add slightly brighter localized rear rim lights/vertical supports or begin modular industrial machinery kit cleanup so the back layer reads as specific production infrastructure.
