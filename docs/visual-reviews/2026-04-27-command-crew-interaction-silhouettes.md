# Visual Review — 2026-04-27 command crew interaction silhouettes

Commit under review: pending
Screenshot: screenshot-blocked-local-browser-policy
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline
Skill focus: add human-scale interaction silhouettes around the hero hologram/table so the hub reads as an active operations floor
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked

Pre-code Game Studio application:
- game-studio: Focused composition/asset-blockout pass. Prior loops established the operations ring and hero hologram; this pass adds the north-star “people actively operating the table” read.
- web-game-foundations: Touch render-scene structure only in the `buildOffice()` assembly. No app state, input, nav, HUD, or DOM changes planned.
- three-webgl-game: Add a small explicit set of operator silhouettes around the central ring with inward poses, console lean/point/commander silhouettes, and cyan/amber rim accents. Keep camera/fog/material system stable and avoid procedural clutter.
- web-3d-asset-pipeline: Primitive-blockout for future modular GLB operator kit: commander silhouette, seated console operator, leaning operator, pointing operator, discussion pair, tablet/arm accents.
- game-ui-frontend: not-applicable — no labels or HUD; the in-world human silhouettes must communicate activity.
- game-playtest: Run module syntax, diff check, macro gate, marker checks; attempt local browser screenshot if policy allows, otherwise record blocker and require public Pages screenshot verification.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid remains untouched as border/proscenium. No exterior geometry or comet/deck-ring drift was added.
Station visibility: 4/5 — The four station districts remain visible; central crew silhouettes clarify the operations hierarchy without covering the room labels/bays.
Lighting/readability: 4/5 — Dark figures use tiny functional cyan/amber visor, chest, hand, and tablet accents. This should read against the blue hologram without becoming neon clutter.
Depth/scale: 4/5 — Foreground commander, mid-ring leaning operators, side discussion pair, and rear seated operators add human scale and depth around the tactical table.

Asteroid border ratio:
- Target: 15–25% of frame.
- Code-level estimate: unchanged around ~17–22%; this pass added only interior people/interaction silhouettes.

Interior facility dominance:
- Target: 75–85% of frame.
- Code-level estimate: unchanged/improved around ~79–84%; the active area now reads more like a staffed command floor.

Station visibility:
- Existing station operators remain in their rooms.
- New crew silhouettes sit around the command table and are pushed into the existing operator animation list for subtle life.
- Poses include commander pointing, console leaning, tablet/discussion, and seated operation.

Lighting/readability note:
- No exposure change was made.
- Readability comes from silhouettes against the blue hologram plus small cyan/amber operational accents.
- Local screenshot remains blocked, so actual silhouette contrast needs public page verification.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked; no procedural rock/marker loops added.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked; silhouettes map to future operator/pose GLB kit pieces.
- game-playtest: local browser attempt recorded blocker: `browser navigation blocked by policy`; syntax/gate/performance checks completed.

What moved closer:
- Added foreground commander silhouette pointing toward the hologram.
- Added two leaning console operators with planted hands and glow pools.
- Added two tablet/discussion operators near the ring.
- Added two rear seated console operators.
- Added subtle animation by registering the new silhouettes in the existing operator update list.

What is still off:
- Needs public screenshot verification against the primary north-star board.
- Silhouettes are primitive blockout, not final suited operator GLBs.
- Pose readability may need scale/placement tweaks once actual pixels are visible.

Next visual fix:
- Public screenshot pass. If the crew reads, refine operator silhouettes/console materials; if they are too noisy or block the hologram, prune/reposition before adding more detail.
