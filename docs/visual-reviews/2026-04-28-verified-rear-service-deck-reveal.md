# Visual Review — 2026-04-28 verified rear service deck reveal

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-rear-service-deck-reveal.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | lighting
Skill focus: use deployed screenshot proof to open the rear service-deck layer with cool fill, shaft ribs, rim seams, and broad industrial silhouettes while keeping the holo-table hero
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition-lighting pass. Deployed proof confirms the fabrication/deploy build is live; screenshot review says the guide lanes improved, but the rear assembly shaft/back half still compresses into a dark horizontal band.
- web-game-foundations: Touch scene construction/readability only. No state, input, navigation, HUD, or DOM copy changes beyond cache-bust.
- three-webgl-game: Keep camera, fog, global exposure, and holo-table lighting stable. Add selective cool fill planes, faint horizontal rear deck seams, vertical shaft ribs, and broad low-detail gantry/module silhouettes. Performance risk is small: fixed primitive meshes, no new animation loops.
- web-3d-asset-pipeline: Primitive-blockout modular kit stance: rear service-deck rib kit, gantry/module silhouette kit, and rim-seam depth cue kit. GLB not introduced; these are placeholders for future industrial modules.
- game-ui-frontend: not-applicable — this is 3D depth/readability, not DOM/UI.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot shows the rear service deck reads as a deeper functional layer, not pure black band; central holo-table remains brightest and sharpest.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid frame and interior facility hierarchy preserved.
Station visibility: 4/5 — Rear service-deck seams/ribs clarify support infrastructure behind staffed stations.
Lighting/readability: 4/5 — Local cool fill/rim seams improve the back half without broad brightening.
Depth/scale: 4/5 — Vertical ribs and broad modules reduce flattening and improve perceived depth.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-fabrication-deploy-20260428`.
- Live runtime markers found: `buildVerifiedFabricationDeploySeparation`, `buildVerifiedOperatorRimSeparation`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-28-live-proof-before-rear-vertical-supports.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-28-verified-rear-service-deck-reveal.png`.
- Post-change image assessment: honestly closer; rear plane reads more layered, cool fill and horizontal rims help, broad modules frame the table; no critical regression; vertical shaft ribs remain weak/subdued.

Lighting/readability note:
- No global exposure/fog/light change was made.
- Readability comes from cool low-opacity fill planes, thin deck seams, vertical shaft ribs, subdued gantry/module silhouettes, and side bay floor lift cues while keeping the central holo-table as the brightest element.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added rear service-deck cool fill planes, bridge/catwalk/base seams, and side bay floor lift cues.
- Added five vertical shaft ribs with cool edge strips plus broad low-detail module/gantry silhouettes.
- Preserved central holo-table dominance and existing operator/fabrication/deploy reads.
- Updated cache-bust marker for deployment.

What is still off:
- Vertical shaft ribbing is still subtle and does not fully sell industrial rear-bay depth.
- Top/rear area can still read as a shadowed shelf rather than a fully active service deck.

Next visual fix:
- Make rear vertical supports and machinery silhouettes more explicit, or begin modular industrial machinery kit cleanup for the rear bay.
