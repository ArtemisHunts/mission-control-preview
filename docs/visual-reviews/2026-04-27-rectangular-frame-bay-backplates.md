# Visual Review — 2026-04-27 rectangular frame bay backplates

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The active rock-cave accent pass was removed and no new asteroid mass was added. Remaining asteroid/comet geometry is pushed behind engineered jambs, lintels, sills, and cover plates so it reads as border/proscenium.
Station visibility: 4/5 — All four districts remain active and visible, now backed by broad production-wall plates and readable headers instead of circular pads or mini-room detail.
Lighting/readability: 4/5 — Circular torus accents were replaced with rectangular cyan/amber production datums. The frame should read cleaner, more industrial, and less decorative/sci-fi toy.
Depth/scale: 4/5 — Depth is carried by large bay backplates, dark work voids, rear factory lintels, service shelves, loading throat, central fabrication line, and compression-frame architecture.

Asteroid border ratio: target 15–25%; implementation estimate is ~14–18% because this pass removes one active rock accent layer and adds engineered interior frame masks over the side/crown areas.
Interior facility dominance: target 75–85%; implementation estimate is ~84–88% after the production backplates, frame lock, rectangular bay landings, and tighter camera make engineered interiors fill nearly all of the default composition.
Station visibility: Build, Review, Deploy, and Observatory keep labels, workcells, operators, bay frames, and accent headers. The new backplates should make districts easier to read at overview distance.
Lighting/readability: The visual language is now broad rectangular industrial lighting rather than rings, glints, beacons, or animated linework. That is closer to the references and better for FPS.
Depth/scale: The scene now layers foreground sill/guard forms, compact command core, fabrication line, bay backplates, side jambs, rear factory lintel, and sealed instrumentation wall.
FPS/performance risk: Lower. Removed active rock-cave accent geometry, removed remaining active torus geometry in ceiling/room pads, removed unused animated callback plumbing, mesh constructors dropped from 13 to 11, and loop markers stayed at 0.

Screenshot/capture note:
- Browser navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Pruned decorative circular accents and one extra active rock layer.
- Replaced mini-room/pad reads with broad production-wall backplates.
- Added engineered side/top/bottom frame masks that preserve asteroid as outer border only.
- Reduced runtime constructor/animation risk while increasing facility-scale reads.

What is still off:
- Needs live screenshot verification for exact border ratio; the code estimate says facility may now be slightly above 85%, which is safer than asteroid dominance but should be visually tuned.
- The room labels remain sprite/canvas textures; useful for visibility, but future polish could replace them with lower-cost signage if needed.
- Further changes should be screenshot-driven, not blind pruning forever.

Next visual fix:
- Restore screenshot capture, then pixel-check whether the engineered frame leaves enough asteroid border texture without letting rock reclaim the subject.
