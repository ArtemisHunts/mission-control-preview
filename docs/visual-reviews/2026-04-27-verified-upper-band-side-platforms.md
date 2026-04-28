# Visual Review — 2026-04-27 verified upper band side platforms

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-27-verified-upper-band-side-platforms.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | lighting
Skill focus: use deployed screenshot proof to break the remaining heavy upper band and make side platforms readable without competing with the holo-table
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition-lighting pass. Deployed proof confirms the clear-sightline build is live; screenshot review says the central table now reads, but the top third is still a heavy dark horizontal ceiling band and side work platforms remain too dark/blocky.
- web-game-foundations: Touch scene construction and render readability only. No mission state, input behavior, navigation model, HUD, or DOM copy change beyond cache-bust.
- three-webgl-game: Keep camera/fog/base exposure stable. Add low-cost ceiling segmentation/rib markers and secondary side platform rim/practical strips so the upper structure reads as architecture and the side platforms read as usable work decks. Performance risk is small: a bounded set of box meshes, no loops in the animation path.
- web-3d-asset-pipeline: Primitive-blockout modular kit stance: ceiling rib/service-panel kit plus side-platform rail/edge-light kit. GLB not introduced; these are future module placeholders.
- game-ui-frontend: not-applicable — the issue is 3D scene readability, not DOM/UI.
- game-playtest: Deployed screenshot captured before edits. Post-change local screenshot proves the upper band is more segmented, side platforms have clearer readable edges, central table remains the hero, and no critical regression appears.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid-base containment stays intact while the overhead reads more like service infrastructure than a flat black slab.
Station visibility: 4/5 — Side platform lips, catwalk edges, supports, and console pinlights make the surrounding work zones easier to parse.
Lighting/readability: 4/5 — Selective rim/practical strips improve readability without global brightening or stealing the holo-table focus.
Depth/scale: 4/5 — Ceiling segmentation and side-platform edges add depth cues around the command pit.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-clear-sightline-20260427`.
- Live runtime markers found: `updateOverviewClearSightline`, `applyVerifiedOverviewOcclusionRelief`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-27-live-proof-before-upper-band-fill.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-27-verified-upper-band-side-platforms.png`.
- Post-change image assessment: honestly closer; upper band reads as layered architecture, side platforms are more legible, central holo-table is not materially hurt, no critical regression.

Lighting/readability note:
- No global exposure/fog lift was made.
- Readability comes from secondary amber/cyan/violet strips, ceiling service-panel separators, and side platform rims while preserving the holo-table as the brightest focal object.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added bounded upper-band service dividers, dark recessed panels, and interrupted practical datums to break the heavy ceiling stripe.
- Added side platform luminous lips, catwalk edges, rail silhouettes, vertical supports, and console pinlights so the side work decks read as usable operations areas.
- Preserved central holo-table dominance.
- Updated cache-bust marker for deployment.

What is still off:
- Upper third remains dark and could use more atmospheric separation later.
- Side platform details are still primitive-blockout and not yet premium GLB-quality assets.

Next visual fix:
- Add a subtle rear-depth/hangar separation pass so the base feels less flat behind the command pit.
