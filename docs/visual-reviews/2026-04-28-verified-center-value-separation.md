# Visual Review — 2026-04-28 verified center value separation

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-center-value-separation.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-value-separation-1410.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: lighting | composition | playtest-fix
Skill focus: value-tier the foreground crew pods below the central holo-table so the command table remains the unmistakable hero.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — treating table glow/rim elements and foreground pod shadow masks as future command-lighting kit parts.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first lighting/composition/playtest-fix pass because deployed proof shows the workstation silhouettes are live but the foreground pods now compete slightly with the holo-table.
- web-game-foundations: render-only scene structure; no state, navigation, click/input, or DOM readout changes.
- three-webgl-game: preserve overview camera and existing geometry; add controlled dark masks on foreground pod zones, localized cyan/white table spill, cleaner circular table rim cues, and minimal added lights; no fog/input changes and low mesh risk.
- web-3d-asset-pipeline: approximate a modular command-lighting kit: table hero rim, spill disk, foreground occlusion masks, operator rim strokes, and floor guide arcs; primitive blockout now, GLB/material-kit-ready later.
- game-ui-frontend: not-applicable — no HUD, labels, menus, or DOM overlays change.
- game-playtest: captured local/current-build screenshot through direct CDP after the edit, compared against deployed proof for table-first hierarchy/pod value separation/no readability regression, ran syntax/diff/macro gates, and committed only because the verdict was honestly closer.

Live proof before edit:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-readable-workstation-silhouettes-20260428`.
- Live app.js SHA matched repo app.js before edit: `15b499847d0244569913a830f4e8c4d78c5ec95f2860a32b1a7fdac86b337029`.
- Recent runtime markers found in deployed app.js: `buildVerifiedReadableWorkstationSilhouettes`, `verified readable workstation silhouette`, `buildVerifiedRearWindowShipSilhouette`, and `verified rear window ship silhouette`.
- Screenshot proof captured from the deployed page via direct CDP `Page.captureScreenshot`: `docs/visual-reviews/2026-04-28-live-proof-before-value-separation-1410.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — preserved the existing shell; this pass mostly changes value hierarchy, not room architecture.
Station visibility: 3/5 — foreground crew pods remain readable while no longer pushing quite as hard against the table.
Lighting/readability: 3/5 — bolder localized table disk/rings and dimmed pod lights improve the table-first read, but the overall scene remains dark/compressed.
Depth/scale: 3/5 — foreground-to-table layering improves slightly; background depth still needs stronger large-form cues.

Lighting/readability note:
- Reduced foreground pod point-light intensity and screen/rim opacity, added dark pod masks/baffles, added a brighter localized cyan table lift disk, crisp outer command ring, white-blue front table read, central spill lines, and a contained table point light. This intentionally keeps the foreground crew as secondary support.

Game Studio checklist:
- pre-code skill application followed; no UI/input drift.
- three-webgl-game: overview camera preserved, render/material/light changes checked, primitive mesh count remains under gate budget.
- web-3d-asset-pipeline: command-lighting kit pieces are named as modular GLB/material-ready blockout parts.
- game-playtest: deployed proof screenshot captured before code; local post-change screenshot captured after code; visual comparison says closer but subtle, with no major regression.

What moved closer:
- Foreground crew pods separate a bit better from the central command table.
- The holo-table remains the first read while the staffed ring still reads as operational support.

What is still off:
- Improvement is incremental; overall scene is still dark and horizontally compressed.
- Background shell/hangar depth needs larger, clearer forms instead of more small lights.

Next visual fix:
- Attack depth/scale with fewer larger architecture/ship/asteroid forms, or move toward modular GLB/proxy assets for workstation/operator quality.
