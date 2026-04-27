# Visual Review — 2026-04-27 target cutaway composition reset

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition
Skill focus: prune abstract slab-stack runtime and make the interior production facility own the first frame
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid is kept as side shoulders, crown, sill, and exposed cut faces. It frames the page like a proscenium instead of becoming the subject.
Station visibility: 4/5 — Build, Review, Observatory, and Deploy were moved inward into four explicit bay walls around the command floor, so the operators sit inside the facility instead of drifting to the page edges.
Lighting/readability: 4/5 — The hotfix lighting remains, but it now illuminates a clearer room: rear glass, open command floor, colored station headers, catwalk cross, and central holo-table.
Depth/scale: 4/5 — The frame keeps rear hangar glass/depth while tightening from the over-wide reset, so the interior facility should occupy the majority of the view.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: ~18–23%. The active asteroid geometry is side shoulder/crown/sill/cut-face framing; old exterior/deck-ring clutter is not called in the overview path.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~77–82%. The active first read is open command floor, tactical pit, station bays, catwalks, rear glass, and broad interior architecture.

Station visibility:
- All four station districts retain labels, room meshes, operators, and accent colors.
- District positions were pulled inward from the far rock edges to the production hall bays.

Lighting/readability note:
- Existing exposure/fill remains because the public hotfix proved the page needed stronger first-frame illumination.
- This pass changes what the lights reveal: fewer anonymous slab bands, more recognizable mission-control room structure.
- No new decorative beacon/marker loops were added.

Game Studio checklist:
- three-webgl-game: camera/FOV/far plane, fixed offset, runtime call chain, syntax, and performance ceilings checked.
- web-3d-asset-pipeline: active forms stay primitive-blockout and modular; deleted inactive legacy functions should later become GLB kits only after screenshot validation.
- game-playtest: local screenshot capture is blocked/pending; public page verification is the next required check.

Depth/scale:
- Rear glass/hangar horizon and broad cutaway frame preserve depth.
- The command pit/holo-table becomes the center anchor; station bays sit as rooms within a larger production floor.

FPS/performance risk:
- Lower. Several older broad-slab/detail paths were removed from the source after being disabled in the active overview call chain.
- The active path uses fewer large architectural forms; mesh constructor count remains well under the gate.
- App size is materially lower after deleting inactive legacy function bodies.

Screenshot/capture note:
- Local screenshot capture was not available in this scheduled worker/browser policy path.
- This review is based on code-level composition against the moodboards/spec and must be visually verified on the public page after deployment.

What moved closer:
- Asteroid reads as a border/proscenium again.
- Interior production facility owns the active frame.
- Central circular holo-table/tactical pit is restored as the hero object.
- Four station bays are explicit and closer to the command floor.
- Older abstract slab-stack/dead-code bodies are pruned to protect FPS, parse weight, and readability.

What is still off:
- Needs actual screenshot verification before adding detail.
- Further legacy pruning may be possible after public visual confirmation, but avoid cutting live station/agent affordances.
- Materials are still primitive blockout, not final Star Atlas/Star Citizen-grade polish.

Next visual fix:
- Verify the public frame. If the composition reads correctly, prune unused legacy function bodies and tune material contrast; do not add exterior props.
