# Visual Review — 2026-04-27 pruned dominant production hall

Commit under review: pending
Screenshot: blocked-headless-chrome/browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid is now treated as a slim proscenium/border. The active runtime no longer stacks five prior correction shells plus marker layers; the remaining rock masses are side/crown/sill context, not the subject.
Station visibility: 4/5 — The camera is pushed in and down enough for the interior hall to own the view while the four districts remain in their quadrants with broad identity rails and room labels.
Lighting/readability: 4/5 — Readability comes from large cyan/amber washes, rear glass, gantry practical edges, and the holo-table instead of many tiny exterior glints. It should be less noisy and less black-crushed.
Depth/scale: 4/5 — A single production hall hierarchy now supplies the big reads: continuous walls, overhead service raft, rear bulkhead, command dais, transverse gantries, and broad bay decks.

Asteroid border ratio: target 15–25%; implementation estimate is roughly 18–22% of the default composition because the side/crown/sill rock is masked by interior cover plates and the camera is tighter on the production hall.
Interior facility dominance: target 75–85%; implementation estimate is roughly 78–82% after replacing five layered correction passes with one large interior production hall and moving the default camera from [0, 13.2, 41.4] to [0, 10.9, 34.8].
Station visibility: Build, Review, Deploy, and Observatory remain visible in the overview; the broad bay rails and room meshes are still built after the hall shell so they should sit readable on top of the architecture.
Lighting/readability: The pass keeps warm/cool practical contrast and broad value separation while pruning small per-bay rock chunks and dense stacked shell overlaps.
Depth/scale: The production hall reads through fewer, larger forms: floor canyon, command foundation, continuous side walls, rear pressure bulkhead, gantries, and roof baffles.
FPS/performance risk: Lower. Runtime calls to five heavy historical interior-correction functions and the tiny macro depth-marker pass were removed; central pit rail posts dropped from 36 to 12; per-bay dodecahedron rock clusters were replaced by two broad cheek plates; pixel ratio cap dropped from 1.35 to 1.12.

Screenshot/capture note:
- Browser tool navigation to local preview was blocked by policy.
- Headless Google Chrome screenshot and DOM capture hung until killed in this worker, so no fresh screenshot was captured.
- Verdict is based on code-level composition changes checked against the moodboards/spec, not on a live rendered image. That is a limitation, but the direction is honest: less clutter, fewer runtime objects, stronger interior hierarchy.

What moved closer:
- Pruned old stacked correction layers that were all rendering at once and fighting FPS/readability.
- Replaced exterior/detail drift with one dominant interior production hall.
- Preserved asteroid as page border/proscenium with cover plates and restrained side/crown/sill rock.
- Increased performance headroom by lowering pixel ratio and runtime geometry count.

What is still off:
- Needs a real visual screenshot on a functioning browser to verify exact border ratio and station occlusion.
- The app still carries unused legacy depth-marker functions in source; they are not called, but future cleanup can delete them if no longer needed.
- The command table may need a hero polish pass once the composition is visually confirmed.

Next visual fix:
- Get a reliable screenshot capture path, verify the 15–25% asteroid border ratio visually, then tune occlusion/lighting if any station is hidden by the new broad hall architecture.
