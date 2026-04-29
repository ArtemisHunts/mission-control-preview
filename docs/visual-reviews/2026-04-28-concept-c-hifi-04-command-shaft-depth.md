# Visual Review — 2026-04-28 Concept C HIFI-04 command-shaft-depth pass

Commit under review: current `concept-c-hifi` HEAD — Add HIFI-04 command shaft depth pass
Branch: `concept-c-hifi`
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hifi-04-command-shaft-depth.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md, docs/visual-reviews/2026-04-28-concept-c-hifi-03-carved-integration.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | composition | playtest-fix
Skill focus: stacked descending ring levels, bridge spans across the shaft, lower silhouettes/lights fading downward, and darker rear shaft falloff so the command core stops reading like a shallow stage.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: take exactly one ladder step. Make the central shaft feel monumentally deep before touching material polish or new bay props.
- web-game-foundations: preserve the approved camera, open star corners, and holo-table hierarchy while concentrating new complexity inside the command well and rear shaft.
- three-webgl-game: use layered descending geometry, selective bridge silhouettes, and controlled emissive falloff so depth improves through form/value, not noise.
- web-3d-asset-pipeline: treat this as a reusable shaft-depth kit that can later be swapped for authored rings, bridges, and lift silhouettes without changing composition intent.
- game-ui-frontend: not-applicable — preserve the current HUD shell.
- game-playtest: run syntax/diff checks, recover a real screenshot if possible, and gate the result honestly against gold-standard Concept C instead of claiming depth from code alone.

North-star question: Does this pass make the command core read as a deep excavated shaft with visible descent layers instead of a shallow recessed pit?
North-star verdict: closer

Container/shell: 3.0/5 — the shell still needs heavier mass and rougher material separation, but it continues to frame the cutaway cleanly without losing the open-space corners.
Station visibility: 2.75/5 — the command hub remains readable and centered, though side-bay detail is still secondary and some lower shaft cues are subtle at default view.
Lighting/readability: 3.0/5 — the holo-table still anchors the frame and the new depth cues add better value separation below it, but the lower facility is still somewhat dark/compressed.
Depth/scale: 3.25/5 — the command well now reads deeper than HIFI-03 thanks to a visible throat, lower rings, bridge spans, and rear falloff, though it still stops short of the monumental drop in the target art.

Concept match: 3.0/5 — closer to the gold-standard asteroid command cutaway, but still short on large-scale excavation drama and material richness.
Improvement over HIFI-03: 3.0/5 — real but modest; the center now reads more like a shaft and less like a shallow stage.
Asteroid shell fidelity: 2.5/5 — the shell silhouette is solid WIP, but rock thickness, crag, and chipped violence still need another push.
Material richness: 2.25/5 — rock/metal/emissive separation improved slightly in the core, yet the overall image still lacks grime, richer metal breakup, and premium surface depth.
Carved integration: 3.0/5 — HIFI-03 still carries most of this win; the new shaft depth kit supports it without breaking the excavated read.
Command shaft depth: 3.0/5 — clear improvement from HIFI-03. Visible lower throat geometry, descending ring cues, lower bridges, depth lights, and rear wall falloff finally suggest a real vertical command drop, but the effect is still subtler than the target concept.
Production/facility fidelity: 2.5/5 — no major facility replacement in this pass by design; surrounding bays still read as supporting WIP rather than hero industrial machinery.
Lighting/depth: 3.0/5 — better center-to-lower falloff and under-table depth cues, but the lower shaft and far facility still need stronger atmospheric layering and practical light hierarchy.
Performance/readiness: 4.0/5 — stable browser-native geometry pass with syntax/diff checks clean and screenshot capture recovered.
Overall: 3.0/5

Lighting/readability note:
- This pass stayed local to the command core. No broad global light-rig rewrite.
- Depth was pushed through darker inner throat geometry, a faint shaft light column, lower cyan glow relocation, receding ring cues, and thinner bridge-light accents instead of blasting the whole room brighter.
- First implementation was too hidden under the existing pit read, so the pass was revised before final screenshot: deeper tapered throat, lower ring stack, deeper bridge spans, and a more visible rear falloff wall.

Game Studio checklist:
- pre-code skill application recorded before runtime edits in this review file.
- three-webgl-game: `node --check --input-type=module < app.js` passed and `git diff --check` passed after the shaft-depth revisions.
- web-3d-asset-pipeline: the new shaft kit is modular enough to replace later with authored GLB rings/bridges/lift cages without changing composition intent.
- game-playtest: local static server + direct CDP screenshot recovery succeeded via `/json/new` target creation and `Page.captureScreenshot`; durable PNG saved.

What moved closer:
- Rebuilt the procedural command shaft from a shallow four-ring hint into a deeper layered throat with six descending wall bands.
- Added visible lower maintenance rings, side wall tapers, rear shaft wall steps, bridge spans, lift silhouettes, and descending depth lights under the command core.
- Deepened the pit itself with a larger black throat, lower cyan base glow, faint central light column, and additional lower bridge/ring cues so the hole reads as more than a flat dark oval.
- Kept the holo-table hierarchy and open-corner composition intact while making the center feel more excavated.
- Added a fresh `index.html` cache-bust so branch previews will not cling to the older HIFI-02 script query.

What is still off:
- The shaft still does not feel bottomless. The lower levels are readable now, but they do not yet deliver the huge vertical drama from the target image.
- Material richness is still undercooked. Rock, steel, grime, and emissives need stronger hierarchy.
- The asteroid shell still reads as faceted WIP instead of truly massive carved stone.
- Production bays remain support geometry, not hero-grade industrial systems.
- Some new depth cues are still subtle at default view and could benefit from stronger silhouette contrast.

Next visual fix:
- Move to HIFI-05 production bay replacement or a tightly scoped material/post pass only if it strengthens the existing shell/shaft/facility hierarchy instead of hiding unresolved structure.
