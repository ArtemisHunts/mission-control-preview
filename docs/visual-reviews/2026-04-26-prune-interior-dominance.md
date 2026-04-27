# Visual Review — 2026-04-26 prune-interior-dominance

Commit under review: pending
Screenshot: blocked-local-current-build
Screenshot blocker: Screenshot capture is still blocked. The corrective pass attempted `google-chrome --headless --screenshot` against a local static server; the session timed out/SIGTERM without producing `/tmp/mc-corrective-shot.png` (and the local server port had to be cleared afterward). Production URL to verify after push: https://artemishunts.github.io/mission-control-preview/
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid border ratio target is now 15–25%. This pass de-emphasizes the exterior/deck-ring drift by disabling noisy exterior aperture/deck-ring calls and replacing them with a slim border/proscenium plus a few broad cutaway forms.
Station visibility: 4/5 — Interior facility dominance target is now 75–85%. Four broad production bay frames, a larger command floor mass, rear production machine blocks, and cleaner floor spines make Build/Review/Observatory/Deploy read as part of the main facility rather than scattered inside rock clutter.
Lighting/readability: 4/5 — Fewer tertiary glints/beacons/tracks should reduce visual noise. The large interior deck lanes, bay headers, restrained practical strips, and command floor massing create a clearer hierarchy than the prior exterior-detail passes.
Depth/scale: 4/5 — Broad rear production wall, observation glass band, lower mechanical shelf, ceiling ribs, and rear machine silhouettes preserve scale/depth with fewer objects. Depth is now carried by big architecture instead of many tiny exterior markers.
FPS/performance risk: 4/5 — Lower risk. Runtime calls to many expensive/noisy exterior functions were pruned, and the pass stays under the gate budgets: app lines, mesh constructors, and procedural loop markers. This is closer because performance degradation is explicitly not north-star.

What moved closer:
- The composition now favors the interior production facility as the subject, with asteroid/comet material acting as a border.
- The camera/fog/far plane were pulled back from the excessive exterior scale and rebalanced toward the production floor.
- Noisy exterior/deck-ring drift was pruned from runtime calls instead of adding more greeble.
- Large interior architecture now does more work: command slab, broad production bays, rear wall, machine silhouettes, ceiling ribs, and clear deck lanes.

What is still off:
- Screenshot capture is still blocked, so the verdict is based on reference benchmarking, code inspection, marker checks, and performance gate output.
- Some unused legacy exterior functions remain in the file for now; they are not called, but a later cleanup can delete them outright if we want a smaller codebase.
- The interior facility likely needs one visual inspection pass to confirm the asteroid border is actually around 15–25% in the deployed frame.

Next visual fix:
- Get a real screenshot/manual visual read, then tune camera/border thickness to hit the 15–25% asteroid border and 75–85% interior facility target precisely.
