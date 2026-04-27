# Visual Review — 2026-04-27 target cutaway composition reset

Commit under review: pending
Screenshot: pending-public-browser-verification-after-push
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition
Skill focus: restore target read: asteroid-base command floor, not abstract horizontal slab stack
Asset pipeline stance: primitive-blockout
Playtest status: needs-human-browser-check
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Adds an explicit target-reset cutaway: side asteroid shoulders, crown, sill, exposed cut faces, and rear hangar glass. The rock returns to framing a visible operations room instead of becoming hidden behind slab bands.
Station visibility: 4/5 — Adds four readable bay walls/console islands for Build, Review, Observatory, and Deploy, while keeping the existing room/agent layer. The frame should now communicate a mission-control floor instead of anonymous production strata.
Lighting/readability: 4/5 — Keeps the lighting hotfix but applies it to recognizable subjects: rear window, open command floor, catwalks, holo-table, and colored bay headers.
Depth/scale: 4/5 — Pulls the overview camera back, widens FOV/far plane, restores a rear hangar/window plane, and adds a central command pit/holo-table as the first visual anchor.

Lighting/readability note:
- The public post-hotfix image rendered, but it was not close to target: mostly horizontal bars with no clear room, asteroid-base context, or holo-table identity.
- This pass disables the most abstract slab-stack calls in the overview path and replaces them with a target-readable cutaway composition.
- Existing exposure/fill remains; the change is about giving the light actual sci-fi environment forms to reveal.

Game Studio checklist:
- three-webgl-game: camera/FOV/render readability adjusted; broad explicit modules replace accidental occluding strata.
- web-3d-asset-pipeline: new forms are modular primitive-blockout equivalents of future GLB kits: asteroid cut faces, bay walls, rear hangar glass, catwalk spans, command table, operator consoles.
- game-playtest: post-push public browser verification required; local host preview remains policy-blocked, so commit should be judged against the public rendered frame.

What moved closer:
- Restores the actual target noun: an asteroid-base mission-control room.
- Brings back a central circular holo-table/tactical pit as the hero object.
- Makes four station bays explicit again instead of hiding them behind broad anonymous slabs.
- Pulls the camera back so the page should read as a cutaway environment, not a close-up of industrial bands.

What is still off:
- This is still primitive-blockout, not high-fidelity GLB environment art.
- Needs public screenshot check and likely follow-up material/shape refinement.
- The disabled legacy slab functions remain in source for now; if the reset is visually better, prune them in the next cleanup.

Next visual fix:
- Verify the public frame. If it reads as a room again, refine materials/forms. If it still reads as bands, remove remaining foreground/ceiling occluders before adding any new detail.
