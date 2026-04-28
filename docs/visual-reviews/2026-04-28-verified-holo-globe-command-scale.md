# Visual Review — 2026-04-28 verified holo globe command scale

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-holo-globe-command-scale.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-holo-globe-1210.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: make the central blue holographic globe/table and immediate operator-console ring read as the operations-floor hero from the verified default camera.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — treating the enlarged holo globe, tactical rings, console reader panels, and operator silhouettes as a future command-table kit.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/playtest-fix pass because the deployed proof shows updates are reaching the scene but the central command object still under-reads versus the north-star board.
- web-game-foundations: render-only scene structure; no state, navigation, click/input, or DOM readout behavior changes.
- three-webgl-game: preserve the overview camera; add a larger cyan holographic volume, brighter table rings, and readable console/operator silhouettes around the pit; use emissive transparent materials and one contained primitive kit with low mesh risk.
- web-3d-asset-pipeline: approximate a modular command-table hero kit: globe shell, scan column, orbit bands, reader screens, console wedges, operator silhouettes, and rim markers; primitive blockout now, GLB-ready naming/scale later.
- game-ui-frontend: not-applicable — no HUD, labels, menus, or DOM overlays change.
- game-playtest: captured local/current-build screenshot after the edit through direct CDP, compared against deployed pre-edit proof for table dominance/operator readability/no clutter regression, ran syntax/diff/macro gates, and committed only because the verdict was honestly closer.

Live proof before edit:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-rear-panorama-ceiling-strips-20260428`.
- Live app.js SHA matched repo app.js before edit: `9e612e7b66e05b79730af900c6a3206febd8010dcf360a6dda5b5c4c2b68244f`.
- Recent runtime markers found in deployed app.js: `buildVerifiedRearPanoramaCeilingStrips`, `verified rear panorama`, `buildVerifiedUpperRearVoidBreaks`, and `buildVerifiedRearRibMachineryBand`.
- Screenshot proof captured from the deployed page via direct CDP `Page.captureScreenshot`: `docs/visual-reviews/2026-04-28-live-proof-before-holo-globe-1210.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — preserved the cutaway shell and rear panorama; this pass did not materially improve the outer container.
Station visibility: 4/5 — the command ring now reads with clearer console panels and seated operator silhouettes around the table.
Lighting/readability: 4/5 — stronger cyan globe/table glow creates a better focal hierarchy without flattening the room; outer shell is still dim.
Depth/scale: 3/5 — central human-scale anchors improve scale, but rear/window depth still needs clearer ship/asteroid context.

Lighting/readability note:
- Added a larger brighter cyan holo sphere/core, wider scan beam, thicker orbit/table rings, console reader panels, operator rim cues, and a contained cyan point light. The center is intentionally brighter while the rear panorama remains secondary.

Game Studio checklist:
- pre-code skill application followed; no UI/input drift.
- three-webgl-game: overview camera preserved, render/material/light changes checked, primitive mesh count remains under gate budget.
- web-3d-asset-pipeline: command-table kit pieces are named as modular GLB-ready blockout parts.
- game-playtest: deployed proof screenshot captured before code; local post-change screenshot captured after code; visual comparison says closer, with slight center clutter but no major regression.

What moved closer:
- The blue holographic globe/table finally anchors the default composition more like the north-star board.
- Operator consoles around the ring are easier to parse as a staffed operations floor instead of an empty architectural model.

What is still off:
- Rear hangar/window context remains too abstract and dark.
- Outer station bays still lack enough readable staff/activity at the default camera.

Next visual fix:
- Clarify the outer station/bay activity with larger readable workstation clusters and restrained traffic cues, or make the rear window show unmistakable ship/asteroid silhouettes.
