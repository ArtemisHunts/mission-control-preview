# Visual Review — 2026-04-27 active runtime prune interior ratio lock

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | performance
Skill focus: remove active micro-detail/light-card clutter and keep the interior facility dominant
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The asteroid remains as the calibrated side/crown/sill proscenium. This pass does not add exterior rocks, beacons, rings, tracks, or page-edge decoration.
Station visibility: 4/5 — Stations stay pulled inward into the active production hall. The pass removes redundant per-room workcell props but keeps station labels, platforms, embedded bay frames, operators, accent headers, and the larger target bay architecture.
Lighting/readability: 4/5 — Removes wide overview translucent district wash planes and volumetric light cards. The retained hotfix lights/witness bars are broad and structural, so readability should stay clear with fewer blended surfaces.
Depth/scale: 4/5 — Depth now comes from large forms only: command floor, holo-table, inward station bays, catwalks, rear production depth, and the cutaway shell.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate after this prune: ~18–23% because no active exterior detail was added and the camera remains tightened from the previous over-wide reset.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: ~77–82%. The frame is carried by interior architecture and broad production forms, not exterior asteroid detail.

Station visibility:
- All four station districts still have positions, labels, room meshes, bay frames, operators, and role colors.
- Per-room mini workcell props were removed because the larger bay architecture already carries station identity at overview distance.

Lighting/readability note:
- Existing exposure/fill and the readability hotfix witness bars remain to avoid regressing toward the prior blank/black-crushed page.
- Removed extra translucent wash planes and volumetric cards that could flatten the frame or tax blending.
- Lighting is now mostly large practical/structural bars plus core scene lights.

Game Studio checklist:
- three-webgl-game: active call chain, camera ratio, transparent surface count, app size, mesh-constructor count, and syntax checked.
- web-3d-asset-pipeline: active geometry remains modular primitive-blockout; no new bespoke prop spam was added.
- game-playtest: local browser navigation returned `browser navigation blocked by policy`; public screenshot verification remains the next required check.

Depth/scale:
- Rear production service decks and dark bay openings remain.
- The command table and inward catwalk network keep a readable center-to-bay spatial plan.

FPS/performance risk:
- Lower. Removed active function bodies/calls for `buildWideOverviewLightingScaffold`, `buildCentralFabricationLine`, `buildWorkspaceProps`, and `buildVolumetricLightPlanes`.
- App size dropped to ~800 lines.
- Mesh constructor count and loop markers remain far under budget.

Screenshot/capture note:
- Attempted local browser preview at `http://127.0.0.1:4173/index.html`.
- Browser tool returned: `browser navigation blocked by policy`.
- This review is code/spec-based and needs public page verification after deploy.

What moved closer:
- Pruned active translucent/light-card clutter.
- Removed micro workcell/fixture props that competed with bay-scale architecture.
- Removed central fabrication-line machinery that overlapped the restored holo-table/tactical pit read.
- Kept asteroid as a border while protecting interior production-hall dominance.

What is still off:
- Needs real pixel verification on the public page.
- If the frame now feels too sparse, add only broad architectural massing—not exterior props or small markers.
- Materials are still blockout-grade.

Next visual fix:
- Public screenshot pass, then tune contrast/materials around the command table and four bay headers without adding runtime clutter.
