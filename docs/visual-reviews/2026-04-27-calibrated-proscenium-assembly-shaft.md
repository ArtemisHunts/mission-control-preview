# Visual Review — 2026-04-27 calibrated proscenium assembly shaft

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Three overlapping asteroid border systems were consolidated into one calibrated proscenium. The rock should now read as a controlled side/crown/sill border, not stacked exterior subject matter.
Station visibility: 4/5 — All four districts remain active. The new assembly shaft sits centrally as facility-scale production machinery while the district backplates/labels preserve quadrant readability.
Lighting/readability: 4/5 — Small rock glints, strata shelves, and inspection lamps were replaced by broader cyan/amber edge datums and large machine surfaces. Cleaner hierarchy, less sparkle.
Depth/scale: 4/5 — A dominant assembly shaft adds a clear production subject: vertical core, black throat, overhead yoke, receiving hopper, clamp jaws, support towers, and conveyor throat.

Asteroid border ratio: target 15–25%; implementation estimate is ~17–22% because the proscenium uses four broad rock masses plus cut faces, but interior frame masks still keep it to the edges.
Interior facility dominance: target 75–85%; implementation estimate is ~78–83% after adding a single large central assembly shaft while preserving the border. This pulls the composition back toward the requested ratio instead of hiding the asteroid entirely.
Station visibility: Build, Review, Deploy, and Observatory keep labels, broad backplates, workcells, operators, and room interactions. No station was removed.
Lighting/readability: The pass favors large industrial datums over tiny decorative markers: cool side edge lines, amber crown/sill lines, cyan inspection spine, and broad process surfaces.
Depth/scale: The assembly shaft gives the scene a more massive factory read than the prior flatter floor/deck composition. It layers with the fabrication line, bay backplates, rear plant depth, and engineered frame.
FPS/performance risk: Lower/flat. The pass removes three overlapping border functions and their small glint/lamp/shelf geometry, replacing them with one border system and one large-form assembly shaft. Mesh constructors remain 11 and loop markers remain 0.

Screenshot/capture note:
- Browser navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Consolidated asteroid treatment into one controlled proscenium.
- Removed small noisy border glints/lamps/strata shelves.
- Added a dominant production object made from fewer large forms.
- Preserved the asteroid as border while giving the interior a stronger manufacturing subject.

What is still off:
- Needs live screenshot verification for exact 15–25% border ratio.
- The scene may now need a material/lighting pass once composition is visually confirmed.
- Further blind pruning risks overcorrecting; next pass should ideally be screenshot-driven.

Next visual fix:
- Restore screenshot capture and pixel-check the border/facility ratio before additional geometry changes.
