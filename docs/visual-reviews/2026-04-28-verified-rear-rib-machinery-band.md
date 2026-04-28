# Visual Review — 2026-04-28 verified rear rib machinery band

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-rear-rib-machinery-band.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: playtest-fix | composition | asset-pipeline
Skill focus: make the rear service-deck ribs and machinery intentionally readable as organized sci-fi infrastructure while preserving the central blue holo-table as hero
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Verification-first playtest-fix/composition pass routed through the standard Mission Control stack. Current deployed screenshot proves the prior scene is live; visual critique says the rear service deck is better but vertical ribs/machinery are still too subtle.
- web-game-foundations: Touch scene construction/rendered environment only. No state, camera controls, input, labels, or HUD changes; only HTML cache-bust after runtime edit.
- three-webgl-game: Keep camera, fog, animation, and global light balance stable. Add one controlled rear machinery band: stronger but subdued vertical support ribs, overhead gantry/cable trays, small machinery boxes, and low-intensity practical strips. Performance risk is low: fixed primitive meshes, two small loops, no new per-frame work.
- web-3d-asset-pipeline: Primitive-blockout modular kit for rear bay architecture: support rib kit, cable tray/gantry rail kit, maintenance box kit, and practical strip kit. GLB integration remains planned later; this pass defines silhouettes and attachment points.
- game-ui-frontend: not-applicable — no DOM/HUD/UI surface changes.
- game-playtest: Post-change local screenshot shows the rear band reads as intentional machinery/ribs, does not become noisy UI clutter, and keeps the holo-table as the brightest focal element.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid proscenium preserved while rear interior structure reads more engineered.
Station visibility: 4/5 — Rear machinery supports station districts without adding crowd or foreground clutter.
Lighting/readability: 4/5 — Subdued practicals/rim strips improve readable structure while keeping table dominance.
Depth/scale: 4/5 — Stronger ribs, trays, and machinery silhouettes make the base feel larger and more industrial.

Visual proof:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-rear-service-deck-20260428`.
- Live runtime markers found: `buildVerifiedRearServiceDeckReveal`, `buildVerifiedFabricationDeploySeparation`.
- Deployed proof screenshot captured: `docs/visual-reviews/2026-04-28-live-proof-before-rear-rib-machinery.png`.
- Local post-change screenshot captured: `docs/visual-reviews/2026-04-28-verified-rear-rib-machinery-band.png`.
- Post-change image assessment: honestly closer; rear machinery band reads more architectural/mechanical, remains subdued, central holo-table remains hero, no major regression. Minor concern: rear band is still broad/dark and slightly compresses vertical space.

Lighting/readability note:
- No global light/fog/exposure changes were made.
- Brightness stays below the central holo-table and mostly on rear/side bands; practicals are dim blue-gray/cyan/amber accents, not competing screens.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: deployed proof captured before edits; post-change proof captured before commit.

What moved closer:
- Added eight stronger rear vertical supports with inset shadow slots and dim vertical practicals.
- Added upper cable trays, lower maintenance rails, and four service transformer/hatch silhouettes concentrated left/right to keep the center behind the holo-table clean.
- Updated cache-bust marker for deployment.

What is still off:
- Rear band remains wide/dark and slightly compresses the upper vertical space.
- Rear machinery is still primitive-blockout; it needs future modular industrial kit cleanup for premium detail.

Next visual fix:
- Lighten/shape the upper rear void with selective negative-space breaks, or convert the rear machinery blockout into a cleaner modular industrial kit.
