# Visual Review — 2026-04-28 verified operator rim separation

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-operator-rim-separation.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | lighting
Skill focus: use deployed screenshot proof to separate weak rear/side operators with subtle rim, helmet, and contact-shadow cues without adding new characters
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition-lighting pass. Deployed proof confirms the operator-anchor build is live; screenshot review says the front/mid anchors read better, but weaker rear/side figures still blend into dark console/ring geometry.
- web-game-foundations: Touch scene construction/readability only. No state, input, navigation, HUD, or DOM copy changes beyond cache-bust.
- three-webgl-game: Keep camera, fog, global exposure, and holo-table lighting stable. Add subtle rim/halo/contact-shadow cues to existing rear/side operators and paired console areas only. No new population density. Performance risk is tiny: fixed box primitives, no new animation loops.
- web-3d-asset-pipeline: Primitive-blockout modular kit stance: operator rim-light/contact-shadow overlays and chair/screen separation cues. GLB not introduced; these are future shader/material/module placeholders.
- game-ui-frontend: not-applicable — this is 3D character readability, not DOM/UI.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot shows rear/side operators separate better at a glance, central holo-table remains hero, and no glowing-outline or clutter regression appears.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Architecture/framing preserved; no new crowding or container drift.
Station visibility: 4/5 — Staffed-console readability improves, especially rear/side silhouettes.
Lighting/readability: 4/5 — Local rim/helmet/contact-shadow cues improve people-read without broad brightening.
Depth/scale: 4/5 — Better separated rear/side figures improve human scale across depth layers.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-operator-anchors-20260428`.
- Live runtime markers found: `buildVerifiedOperatorReadabilityAnchors`, `buildVerifiedOperatorWorkstationActivity`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-28-live-proof-before-helmet-rim-readability.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-28-verified-operator-rim-separation.png`.
- Post-change image assessment: closer; rear/side operators are more readable from small rim/halo/contact-shadow cues; holo-table remains focal; no critical regression or clutter; far-side operators are still somewhat subtle.

Lighting/readability note:
- No global exposure/fog/light change was made.
- Readability comes from localized cyan/amber/violet/green rim strips, small helmet glints, chair/backing silhouettes, and contact shadows around existing figures.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added subtle separation overlays for existing rear anchor, seated rear, and side/bay operators.
- Added localized helmet glints, shoulder/forearm rims, chair backings, contact shadows, and shared rear/side readability datums.
- Preserved central holo-table dominance and avoided adding new characters.
- Updated cache-bust marker for deployment.

What is still off:
- Far-side operators remain small and partially lost against similar-value background machinery.
- Character assets are still primitive-blockout, not premium hero modules.

Next visual fix:
- Either add a tiny bit more localized floor/contact contrast to the far-side silhouettes, or start a modular character-console kit cleanup so the staffed ring reads premium instead of box-built.
