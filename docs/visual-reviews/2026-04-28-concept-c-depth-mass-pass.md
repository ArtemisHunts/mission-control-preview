# Visual Review — 2026-04-28 Concept C depth/mass continuation pass

Commit under review: pending WIP
Screenshot: docs/visual-reviews/2026-04-28-concept-c-depth-mass-pass.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | playtest-fix
Skill focus: keep moving toward gold-standard Concept C by improving rock-swallowed architecture, asteroid mass, production readability, and pit depth.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — tunnel mouths, bolted rims, contact-shadow strips, worker scale markers, fractured rock teeth, lower sill mass, descending pit rings/lights are proxy modules for future GLB kit work.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: focused WIP continuation pass; not a live deployment.
- web-game-foundations: render-only changes on `concept-c-wip`; no interaction/state changes.
- three-webgl-game: added grouped details for rock-swallowed facility contact, service tunnels, lower pit rings, heavier lower sill, and scale markers.
- web-3d-asset-pipeline: strengthened modular asset vocabulary for asteroid shell, drilled supports, tunnels, production floor details, and command shaft pieces.
- game-ui-frontend: not-applicable; minimal readout preserved.
- game-playtest: captured local CDP screenshot and ran visual gate. Verdict: improved/save WIP/not ship-ready.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — asteroid shell and open corners are now legible; still needs less capsule symmetry and nastier rock thickness.
Station visibility: 4/5 — production/command zones read more clearly with workers, tunnels, contact shadows, and hero bay language.
Lighting/readability: 4/5 — central cyan and warm production lighting work; more black contact occlusion needed under rock ceiling.
Depth/scale: 4/5 — better lower sill, pit rings/lights, and worker markers; central pit still needs stronger vertical shaft read.

Lighting/readability note:
- The scene is now presentable as a WIP: open star corners, central command core, left production bay, and cutaway silhouette all read. The remaining problem is gold-standard material/depth, not basic direction.

Game Studio checklist:
- worked only on `concept-c-wip`.
- live/main untouched.
- syntax/diff checks passed.
- screenshot captured after changes.
- visual gate: improved, average ~3.84/5, save WIP, do not ship final yet.

What moved closer:
- Rock-swallowed facility feeling improved with tunnel mouths, bolted rims, contact shadows, and side chunks.
- Production bay and worker scale markers improved scale/readability.
- Lower asteroid sill is heavier and less clean.
- Command pit gained deeper shaft/ring/light cues.

What is still off:
- Lower sill still reads too platform-like.
- Interior floor is too planar; needs stepped excavated levels.
- Pit is recessed but not yet a dramatic vertical command shaft.
- Asymmetry should be bolder.

Next visual fix:
- One more pass: jagged/sagging lower sill, stepped excavation levels, larger asymmetric side mass, more brutal contact shadows, and stronger descending command-shaft depth.
