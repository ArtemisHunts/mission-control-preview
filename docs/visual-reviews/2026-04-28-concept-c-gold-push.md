# Visual Review — 2026-04-28 Concept C gold-push WIP

Commit under review: pending WIP
Screenshot: docs/visual-reviews/2026-04-28-concept-c-gold-push.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | playtest-fix
Skill focus: execute Michael's requested updates: break the asteroid slab, make the hero production bay louder, and make the command pit read more sunken.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — ship-frame build bed, enlarged fabrication bay, robotic arm, conveyor, crew scale markers, broken shell chunks, pit lip/stair/glow modules are WIP proxies for GLB kit assets.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: focused Concept C WIP art pass; no live deployment.
- web-game-foundations: render-only scene improvements on `concept-c-wip`; no state/input changes.
- three-webgl-game: adjusted shell geometry, production-bay staging/light, and pit depth markers while preserving camera and minimal HUD.
- web-3d-asset-pipeline: improved blockout language for future high-fidelity asteroid/production/pit modules.
- game-ui-frontend: not-applicable beyond preserving current UI shell.
- game-playtest: captured local CDP screenshot and ran visual gate. Verdict: improved/save WIP/do not ship final.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — top shell is more broken and asymmetric, but still too smooth/graphic for gold-standard asteroid mass.
Station visibility: 3/5 — hero production bay reads better with ship-frame/arm/conveyor; still secondary to central cyan pit.
Lighting/readability: 3/5 — bay lighting improved and open corners still work; overall lateral depth is still compressed.
Depth/scale: 3/5 — pit glow/foreground lip/stairs/crew markers improve the read, but it still needs stronger vertical shaft depth.

Lighting/readability note:
- Brighter warm production light and lower pit glow improved focus separation, but the cyan core still dominates the scene.

Game Studio checklist:
- worked only on `concept-c-wip`.
- live/main untouched.
- syntax/diff checks passed.
- screenshot captured after changes.
- visual gate says improved and worth saving, not final/live-ready.

What moved closer:
- Production bay now has a clearer ship-frame build bed, robotic arm, conveyor, cargo, crane, and warm local light.
- Top asteroid silhouette is more broken and less perfectly roof-like.
- Command pit has stronger foreground lip, stair treads, bottom glow, and crew scale markers.

What is still off:
- Asteroid still needs nastier mass, stronger thickness variation, and more faceted rock finish.
- Carved integration needs more rooms swallowed by rock, contact shadows, anchors, and tunnels.
- Hero production bay needs to compete more strongly with the central cyan core.
- Pit still needs visible descending wall rings / vertical shaft sides.

Next visual fix:
- One more focused art pass on asteroid mass + carved integration + hero-bay focal hierarchy before considering any live deployment.
