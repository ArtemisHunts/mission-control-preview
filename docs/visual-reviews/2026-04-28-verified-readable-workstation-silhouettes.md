# Visual Review — 2026-04-28 verified readable workstation silhouettes

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-verified-readable-workstation-silhouettes.png
Proof screenshot before edit: docs/visual-reviews/2026-04-28-live-proof-before-workstation-silhouettes-1340.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | playtest-fix
Skill focus: replace tiny/noisy operator reads with fewer larger workstation silhouettes around the central holo-table.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — treating foreground/midground workstation pods, seated/standing operator silhouettes, screen planes, chairs, and rim lights as a future command-crew kit.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: classify as a verification-first composition/lighting/playtest-fix pass because the deployed proof shows the scene is current, but the operators around the hero table still read too small/noisy for the north-star mission-control floor.
- web-game-foundations: render-only scene structure; no app state, navigation, click/input, or DOM readout changes.
- three-webgl-game: preserve overview camera, central holo-table hierarchy, and rear hangar context; add fewer larger readable workstation pods with human-scale silhouettes, screen planes facing the table, warm/cool rim cues, and no extra procedural loops.
- web-3d-asset-pipeline: approximate a modular command-crew kit: console pod, chair base, seated torso/head, standing supervisor, screen plane, rim strip, and floor contact shadow; primitive blockout now, GLB-ready naming/scale later.
- game-ui-frontend: not-applicable — no HUD, menu, DOM, or label changes.
- game-playtest: captured local/current-build screenshot through direct CDP after the edit, compared against deployed proof for operator readability/table hierarchy/no clutter regression, ran syntax/diff/macro gates, and committed only because the verdict was honestly closer.

Live proof before edit:
- Deployed HTML cache-bust found before edit: `app.js?v=verified-rear-window-ship-silhouette-20260428`.
- Live app.js SHA matched repo app.js before edit: `c0f34cd33c3627fd2cf3f9f2874f2d74e7b0b3e4e0fbbaa20c1fdb758290c544`.
- Recent runtime markers found in deployed app.js: `buildVerifiedRearWindowShipSilhouette`, `verified rear window ship silhouette`, `buildVerifiedOuterBayActivityReadability`, and `verified outer bay activity`.
- Screenshot proof captured from the deployed page via direct CDP `Page.captureScreenshot`: `docs/visual-reviews/2026-04-28-live-proof-before-workstation-silhouettes-1340.png`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — shell and rear hangar context were preserved; this pass did not materially change the container.
Station visibility: 4/5 — fewer/larger workstation pods, operators, screens, chairs, and rim cues around the command pit now read more clearly as staffed mission-control positions.
Lighting/readability: 3/5 — screen glow and operator rim cues improve local readability, but the bright front ring now competes slightly with the holo-table.
Depth/scale: 4/5 — larger human-scale silhouettes improve foreground/midground scale and make the operations floor feel more staffed.

Lighting/readability note:
- Added contained cyan/amber screen planes, visor/rim slashes, floor contact shadows, and small local warm/cool fills. The holo-table remains the primary focal glow, though the front commander pod is now a stronger secondary read.

Game Studio checklist:
- pre-code skill application followed; no UI/input drift.
- three-webgl-game: overview camera preserved, render/material/light changes checked, primitive mesh count remains under gate budget.
- web-3d-asset-pipeline: command workstation/operator kit pieces are named as modular GLB-ready blockout parts.
- game-playtest: deployed proof screenshot captured before code; local post-change screenshot captured after code; visual comparison says closer, with mild foreground competition but no critical regression.

What moved closer:
- Operators and workstation pods are now readable at default camera scale instead of mostly tiny specks.
- The command ring feels more staffed, cinematic, and operational around the blue holo-table.

What is still off:
- The foreground ring can compete with the table and needs better value separation.
- Operators are still primitive blockout; a future GLB/proxy kit would beat more boxes.

Next visual fix:
- Improve value separation between the foreground crew pods and holo-table, or move to a real modular operator/workstation proxy asset instead of adding more primitive detail.
