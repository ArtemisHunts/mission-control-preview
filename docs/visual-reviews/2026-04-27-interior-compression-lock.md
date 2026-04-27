# Visual Review — 2026-04-27 interior compression lock

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid is further demoted to a perimeter/proscenium. New interior pressure walls, crown mask, and cheek plates cover the visual edges that previously let rock/exterior elements compete with the room.
Station visibility: 4/5 — Four stations remain in the overview and no station district was removed. The tighter camera risks slightly less margin, but the broad bay identities stay readable because beacons/marker spam were removed rather than added.
Lighting/readability: 4/5 — Rear wall is now a sealed instrumentation band with restrained cyan/amber telemetry, not a bright exterior vista. Static readability washes replace animated attention noise.
Depth/scale: 4/5 — Depth now comes from large interior crossbeams, pressure walls, side machinery blocks, rear blast-door mass, and production gantries instead of exterior asteroid/deck-ring scenery.

Asteroid border ratio: target 15–25%; implementation estimate is ~15–20% after the compression lock masks side/crown rock and the camera moves tighter into the production facility.
Interior facility dominance: target 75–85%; implementation estimate is ~80–85% because the frame is now filled by sealed rear instrumentation, broad pressure walls, command apron, crossbeams, machinery blocks, and production decks.
Station visibility: Build, Review, Deploy, and Observatory remain active clickable room groups; the pass removes decorative beacons but keeps labels, bay frames, accent rails, workstations, and operators.
Lighting/readability: The scene should read more as an interior operations plant: lower FOV, closer camera, shorter fog range, sealed back wall, cyan/amber datum lines, and fewer animated glints.
Depth/scale: Large forms carry scale: inner pressure walls, top lintel, rear blast door, side machinery, and full-width production crossbeams. This follows the reference boards better than tiny rocks or external sparkle.
FPS/performance risk: Lower. Pixel ratio cap dropped to 1.0; active exterior vista and asteroid glint calls were removed; active metrics tower/beacon calls were removed; animated per-room beacon pulses were deleted; mesh constructors went from 25 to 24 and loop markers from 3 to 2 under the gate.

Screenshot/capture note:
- Browser tool navigation to the local preview was blocked by policy during this pass.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Replaced exterior window subject matter with sealed interior instrumentation.
- Removed asteroid glints, exterior vista, metric towers, and room beacons from runtime.
- Added broad interior compression architecture to make the production facility own the frame.
- Tightened camera/FOV/fog and lowered pixel ratio for FPS protection.

What is still off:
- Needs a live screenshot verification pass once browser capture is available.
- The exact visual border ratio still needs pixel-level confirmation.
- The old source still has some legacy arrays/animation support for removed systems; harmless but cleanup-worthy.

Next visual fix:
- Verify with an actual screenshot, then tune station spacing/occlusion if the tighter production-hall frame hides any district.
