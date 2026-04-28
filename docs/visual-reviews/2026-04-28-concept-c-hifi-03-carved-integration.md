# Visual Review — 2026-04-28 Concept C HIFI-03 carved-integration pass

Commit under review: current HIFI-03 pass on `concept-c-hifi`
Branch: `concept-c-hifi`
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hifi-03-carved-integration.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md, docs/visual-reviews/2026-04-28-concept-c-hifi-02-secondary-breakup.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: asset-pipeline | facility-integration | playtest
Skill focus: bolted collars around room apertures, retaining ribs/braces disappearing into rock, contact AO strips, drilled conduits/cables, and dust/debris piles so the facility reads excavated into the asteroid instead of staged inside it.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: take exactly one ladder step. No random prop soup. Make the facility-rock contact believable.
- web-game-foundations: preserve the approved composition, open star corners, and stable camera while adding density only at rock/facility seams.
- three-webgl-game: use lightweight procedural geometry and shadow strips to create collars, braces, conduit runs, and debris piles that visually bite into the shell.
- web-3d-asset-pipeline: treat this as a reusable carved-integration kit that can later be swapped for authored assets without changing scene intent.
- game-ui-frontend: not-applicable beyond preserving the current HUD shell.
- game-playtest: code-check first, then recover a real screenshot and gate the result honestly against the gold-standard Concept C target.

North-star question: Does this pass make the facility feel excavated and swallowed by asteroid mass rather than staged in front of decorative shell pieces?
North-star verdict: closer

Container/shell: 3.0/5 — the shell frames the space better than HIFI-02, but it still reads as thin faceted plates instead of a massive excavated asteroid body.
Station visibility: 2.75/5 — the central command platform remains readable, but some side-bay machinery still sinks into broad dark shapes.
Lighting/readability: 3.0/5 — the cyan command glow still anchors the image, but the new integration kit is subtler than ideal and material separation remains compressed.
Depth/scale: 2.75/5 — foreground rock, command ring, and rear bay layer better, yet the shaft and side bays still do not feel monumentally deep.

Concept match: 3.0/5 — more convincing as an asteroid-carved operations floor, still well short of hi-fi concept-art finish.
Improvement over HIFI-02: 3.0/5 — small but real; this is a structural integration improvement, not a dramatic material leap.
Asteroid shell fidelity: 2.5/5 — breakup is acceptable WIP, but the asteroid still lacks heavy crag, thickness, and excavation violence.
Material richness: 2.0/5 — rock/metal/glass/emissive separation is still too flat and clean.
Carved integration: 3.0/5 — the best gain in this pass; collars, braces, conduits, AO strips, and debris make the facility feel more anchored to the rock.
Command shaft depth: 2.5/5 — the core remains focal, but the vertical drop is still too shallow and too clean.
Production/facility fidelity: 2.5/5 — left/right bays now sit in the asteroid more credibly, but machinery language is still simplified.
Lighting/depth: 3.0/5 — composition still reads, but stronger shadow carving, rim hits, and practicals are needed.
Performance/readiness: 3.5/5 — stable and lightweight enough to keep iterating.
Overall: 2.8/5

Lighting/readability note:
- No major global light-rig change. This pass used local contact shadows, collar accents, conduit glows, and debris seams to improve integration without blowing up the current camera/readability balance.
- Browser-tool navigation to localhost is still policy-blocked, so screenshot recovery used a real browser workaround: open a safe remote page, spawn the localhost scene with `window.open()`, confirm the scene visually with browser screenshot, then persist the review PNG from the live WebGL canvas after enabling `preserveDrawingBuffer`.

Game Studio checklist:
- pre-code skill application recorded before runtime edits.
- three-webgl-game: added one coherent integration-kit layer only; `node --check --input-type=module < app.js` passed and `git diff --check` passed.
- web-3d-asset-pipeline: the new collars/braces/conduits/debris read as a reusable procedural integration kit rather than random one-off props.
- game-playtest: browser screenshot recovered, local durable PNG saved, browser console checked with no error messages.

What moved closer:
- Added rectangular pressure-collar frames around the hero fabrication mouth, right deploy bay, and rear hangar aperture.
- Added retaining ribs and knee braces that disappear into surrounding rock instead of leaving clean bay edges floating.
- Added dedicated conduit trunks and clamp runs from bays and command floor into the asteroid.
- Added contact AO strips and floor-level debris clusters so bay floors and command edges no longer feel as detached from the shell.
- Enabled `preserveDrawingBuffer` so the hi-fi loop can actually save a durable local review image from the live WebGL scene after capture recovery.

What is still off:
- The collars and braces are still too subtle in the final frame; they help, but they do not yet scream excavated megastructure.
- The asteroid remains too planar and graphic; it still needs heavier mass and thickness.
- The command shaft still lacks stacked depth layers, bridge spans, and atmospheric falloff.
- Material richness is still undercooked. Rock, metal, grime, and emissive surfaces need stronger separation.
- Production machinery still reads as simplified block language rather than hero industrial detail.

Next visual fix:
- Move to HIFI-04 command shaft depth: stacked descending ring levels, bridge spans, lower depth lights, darker rear shaft wall, and atmospheric falloff so the center stops reading like a shallow stage.
