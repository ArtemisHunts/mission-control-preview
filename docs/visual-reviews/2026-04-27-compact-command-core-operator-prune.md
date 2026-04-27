# Visual Review — 2026-04-27 compact command core operator prune

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The pass did not add exterior asteroid mass. Camera nudged tighter and new overhead plant panels reinforce the engineered interior, keeping asteroid/comet as edge context/proscenium.
Station visibility: 4/5 — Room districts remain active and visible. Operator avatars are simplified but still provide human scale without cluttering station reads.
Lighting/readability: 4/5 — The animated holo-table/node cluster was replaced by a compact command process core with broad cyan/amber datums, reducing sparkle while preserving a readable central mission object.
Depth/scale: 4/5 — Large interior forms now carry the frame: fabrication line, compression walls, overhead plant bays, compact process core, rear plant depth, and broad station workcells.

Asteroid border ratio: target 15–25%; implementation estimate remains ~15–20% because the pass tightens camera/framing and adds only interior overhead metalwork, not more rock.
Interior facility dominance: target 75–85%; implementation estimate is ~83–86% after shrinking the command-table visual noise, adding overhead plant bays, and leaving production architecture as the largest read.
Station visibility: Build, Review, Deploy, and Observatory remain clickable room groups with labels, broad workcells, operators, and accent rails. The simplified avatars should help scale without becoming prop clutter.
Lighting/readability: Broad command core surfaces, station bands, fabrication-line datums, and overhead plant silhouettes replace animated mission nodes and operator micro-kit highlights.
Depth/scale: Depth is reinforced by fewer large layers: foreground command guard forms, compact command core, central fabrication line, overhead plant bays, side compression walls, rear production decks.
FPS/performance risk: Lower. The old animated holo-table/node cluster was removed, operator avatar geometry was simplified, mesh constructors dropped from 19 to 13, and procedural loop markers stayed at 0.

Screenshot/capture note:
- Browser navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Removed the command-table animation cluster that was becoming a small-detail focal point.
- Simplified operators into low-poly scale silhouettes.
- Added broad overhead plant panels to make the production hall feel more enclosed and dominant.
- Tightened camera framing while keeping station groups intact.

What is still off:
- Needs live screenshot verification for exact asteroid border ratio and station occlusion.
- The remaining room rings and ceiling recess are still decorative torus geometry; acceptable for now, but they are candidates for the next prune if the visual remains too busy.
- Further changes should be pixel-guided once capture works.

Next visual fix:
- Capture a real frame, verify whether remaining torus/ring accents help readability or should be replaced by broad rectangular production forms.
