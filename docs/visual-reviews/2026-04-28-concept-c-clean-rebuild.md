# Visual Review — 2026-04-28 Concept C clean rebuild WIP

Commit under review: WIP branch candidate
Screenshot: docs/visual-reviews/2026-04-28-concept-c-clean-rebuild.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | playtest-fix
Skill focus: rebuild Mission Control from scratch as one purpose-built asteroid cutaway environment instead of patching the old room.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — current geometry is a clean low-poly blockout for future asteroid shell, production machinery, command pit, and embedded support GLB modules.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael approved scrapping the previous version and rebuilding around Concept C. The work is a dedicated environment rebuild, not incremental decoration.
- web-game-foundations: old scene kept in git history; current app is simplified to one clean render scene with a small DOM readout and no old room navigation complexity.
- three-webgl-game: vanilla Three.js scene, explicit camera, render loop, named mesh groups, low-chrome UI, screenshot-gated visual review.
- web-3d-asset-pipeline: primitive blockout for asteroid shell thickness, carved cut faces, production kit, gantries, conveyors, tanks, command pit tiers, and operator scale cues. GLB/proxy art pass required before final.
- game-ui-frontend: HUD kept minimal; bottom dock hidden for Concept C read.
- game-playtest: captured local 1600x900 screenshot via CDP; multiple visual gates run; current result is not ship-ready but worth saving as WIP.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — top/bottom/side asteroid framing and open corners are now directionally correct, but still too symmetrical and slab-like for final.
Station visibility: 3/5 — command center and facility modules are visible; production purpose still needs stronger silhouettes.
Lighting/readability: 4/5 — central cyan glow and open-space corners work better; some interior detail still crushes into darkness.
Depth/scale: 3/5 — layered cutaway is readable; command pit and rock thickness need stronger vertical depth.

Lighting/readability note:
- The open star corners and central command glow are the strongest current reads. Rock/facility material separation needs more rim light, strata, and embedded contact shadows.

Game Studio checklist:
- old scene replaced locally by a clean Concept C scene rather than patched.
- runtime kept simple and direct; no old navigation room complexity carried forward.
- screenshot captured and reviewed before any live/main push.
- visual gate verdict: revise, save as WIP branch, do not ship to live yet.

What moved closer:
- Clean from-scratch scene architecture.
- More obvious open star corners.
- More asteroid-shell-first composition.
- Production kit and command pit are now present as readable WIP systems.

What is still off:
- Asteroid shell is still too symmetrical/slab-like.
- Facility needs more carved-rock integration and embedded supports.
- Production modules need unmistakable manufacturing silhouettes.
- Command pit needs more visible lower-tier depth, stairs/rails, and occlusion.

Next visual fix:
- Continue on WIP branch: break symmetry, add carved alcoves and rock-to-metal seams, push command pit depth, and build one hero production bay with crane/conveyor/robot arm/tank silhouettes before considering live deployment.
