# Visual Review — 2026-04-27 fabrication line dominance

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid remains a border/proscenium while another layer of nonessential animated interior/exterior linework was removed. The tighter camera and shorter fog keep attention inside the production hall.
Station visibility: 4/5 — All four station room groups remain active and visible in their quadrants; the new fabrication line is central and broad rather than a swarm of markers, so it should not replace the stations as tiny clutter.
Lighting/readability: 4/5 — Readability shifts from animated signal tubes and glowing decorative ribs to larger cyan/amber production surfaces, crane edges, and inspection glass. Holo-table geometry was simplified so it supports the room rather than eating budget.
Depth/scale: 4/5 — The frame now has a stronger production-floor read: central conveyor bed, overhead crane rails, suspended component silhouette, broad clamp arms, logistics decks, rear plant depth, and sealed instrumentation wall.

Asteroid border ratio: target 15–25%; implementation estimate stays ~15–20% because this pass did not expand rock, and the camera/fog moved further toward the interior production hall.
Interior facility dominance: target 75–85%; implementation estimate is ~82–86% after removing signal/cable/rib decoration and adding a central fabrication line that fills the midground with production architecture.
Station visibility: Build, Review, Deploy, and Observatory remain in the overview with labels, alcoves, operators, and bay accent rails. The production line sits between them as a facility-scale object, not a station replacement.
Lighting/readability: Large cyan/amber practical accents and static washes carry the read. Animated signal-lane pulses, cable tubes, and the decorative overhead ring were pruned to reduce attention noise.
Depth/scale: Scale is now carried by fewer large forms: central conveyor, crane carriage, suspended component, clamp arms, logistics decks, compression walls, and rear production bays.
FPS/performance risk: Lower. Removed animated signal-lane TubeGeometry, overhead cable TubeGeometry, decorative rib/ring animation, unused tower and signal-orb update loops, and reduced holo-table torus/cylinder segment counts. Gate shows mesh constructors down to 21 and loop markers at 2.

Screenshot/capture note:
- Browser tool navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Replaced decorative animated tracks/cables with one readable, performance-safe production line.
- Strengthened the production-facility identity with conveyor, crane, clamp arms, and suspended component massing.
- Tightened camera/FOV/fog so the facility owns more of the default frame.
- Reduced runtime animation/update noise.

What is still off:
- Needs live screenshot verification for exact border ratio and station occlusion.
- Central holo-table still exists; it is useful for Mission Control, but future work should ensure the fabrication line and operations floor dominate at overview distance.
- Some small station prop detail remains; acceptable for role readability, but no more prop spam until composition is visually proven.

Next visual fix:
- Restore screenshot capture, then tune central fabrication massing and station occlusion from an actual frame instead of code inference.
