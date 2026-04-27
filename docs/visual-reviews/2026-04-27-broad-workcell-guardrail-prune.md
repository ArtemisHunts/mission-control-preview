# Visual Review — 2026-04-27 broad workcell guardrail prune

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — This pass did not add asteroid mass. The tighter camera and broader interior workcells continue pushing the asteroid/comet into a page-border/proscenium role instead of a subject role.
Station visibility: 4/5 — All four room groups remain active and visible, but station interiors now use fewer large workcell silhouettes instead of console/chair micro-detail. That should improve wide-read station clarity.
Lighting/readability: 4/5 — Fewer tiny emissive key strips, rail posts, and prop bits means the remaining cyan/amber bands and broad machine faces carry the read with less shimmer/noise.
Depth/scale: 4/5 — The interior now reads more like a production floor: broad station plinths, vertical process slabs, central fabrication line, large command guard rails, rear plant depth, and compression walls.

Asteroid border ratio: target 15–25%; implementation estimate remains ~15–20% because no new rock was added and the camera moved slightly tighter into the facility.
Interior facility dominance: target 75–85%; implementation estimate is ~82–86% after replacing small station prop kits with large production workcells and replacing the command rail necklace with big guard forms.
Station visibility: Build, Review, Deploy, and Observatory keep labels, bay frames, accent bands, operators, and broad role-specific workcells. The pass removes micro-detail, not district identity.
Lighting/readability: Broad status bands and large emissive datums replace many small pips/key strips/rail glows. This should make the wide overview cleaner and less visually noisy.
Depth/scale: Large foreground/midground forms now carry scale: production workcells, command pit guard rails, fabrication line, side machinery, rear plant decks, and sealed instrumentation wall.
FPS/performance risk: Lower. Console/chair micro-kit detail was pruned, the central post/rail procedural loop was removed, mesh constructors dropped from 21 to 19, and procedural loop markers dropped to 0 under the gate.

Screenshot/capture note:
- Browser navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Replaced many small station prop details with fewer large production workcells.
- Removed the tiny central pit post/rail loop in favor of eight broad guard/datum forms.
- Tightened default framing slightly toward the interior production facility.
- Reduced FPS risk and visual noise without adding exterior clutter.

What is still off:
- Needs live screenshot verification for the exact asteroid border ratio and station occlusion.
- The central holo-table still has animated mission elements; it remains appropriate, but should stay secondary to the production floor at overview distance.
- Future passes should avoid new tiny prop clusters until the screenshot confirms the composition.

Next visual fix:
- Capture a real frame, verify 75–85% facility dominance, then adjust broad workcell positions if any district is hidden by the tighter camera.
