# Visual Review — 2026-04-27 broad bands rear plant consolidation

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The calibrated asteroid proscenium is preserved. This pass does not add exterior rock; it adds/merges engineered interior bands so the rock stays as side/crown/sill border context.
Station visibility: 4/5 — All four station districts remain active. The room/backplate system is unchanged, while rear monitors, ceiling coves, and plant depth are simplified into larger readable bands that should reduce competing micro-detail.
Lighting/readability: 4/5 — Small monitor tiles, ceiling strip repetitions, and rear marker lights were consolidated into broad cyan/amber production bands. Shadow maps were disabled for FPS protection and cleaner runtime cost.
Depth/scale: 4/5 — Rear depth now comes from broad service decks, dark bay openings, continuous rails, compression piers, and factory transfer lanes rather than many little marker-like pieces.

Asteroid border ratio: target 15–25%; implementation estimate remains ~17–22% because the proscenium geometry is unchanged and the new broad interior bands do not expand rock coverage.
Interior facility dominance: target 75–85%; implementation estimate remains ~78–83%, now with a cleaner interior read from broad deck plates, transfer lanes, sealed rear instrumentation, rear plant masses, assembly shaft, and bay backplates.
Station visibility: Build, Review, Deploy, and Observatory keep labels, operators, broad workcells, and interaction meshes. This pass should improve readability by removing small background noise, not by hiding stations.
Lighting/readability: The visual hierarchy is less sparkly: fewer tiny telemetry tiles, fewer ceiling strips, fewer rear marker lights, and broader lighting coves/workflow lanes.
Depth/scale: Facility scale is carried by consolidated rear plant layers, production deck lanes, assembly shaft, engineered frame locks, and the sealed instrumentation wall.
FPS/performance risk: Lower. Shadow maps are disabled; multiple small forEach-generated monitor/ceiling/rear-depth marker groups were replaced with larger static forms; mesh constructors dropped from 11 to 10; loop markers remain 0.

Screenshot/capture note:
- Browser navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Consolidated small rear monitors/tiles into broad instrumentation bands.
- Replaced repeated ceiling strips with larger production coves.
- Replaced rear plant marker loops with fewer large service decks/openings/piers.
- Disabled shadow maps to protect FPS.

What is still off:
- Needs live screenshot verification for exact border ratio and station occlusion.
- The current direction has reached the point where additional blind geometry edits risk overcorrecting.
- Material/lighting tuning should be screenshot-driven next.

Next visual fix:
- Restore screenshot capture, then tune light values and border/facility ratio from pixels rather than code inference.
