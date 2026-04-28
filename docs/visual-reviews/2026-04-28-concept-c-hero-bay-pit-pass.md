# Visual Review — 2026-04-28 Concept C hero bay / pit pass

Commit under review: pending WIP
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hero-bay-pit-pass.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | playtest-fix
Skill focus: push the clean Concept C rebuild forward with one unmistakable hero production bay, stronger command-pit depth cues, and less symmetric asteroid mass.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — hero fabrication bay crane/conveyor/robot arm/cargo modules, pit rail/stair/occlusion pieces, and asymmetric rock bites are blockouts for later GLB kit modules.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: focused WIP art pass on Concept C environment readability, not live deployment.
- web-game-foundations: no input/simulation changes; render-only environment blockout on the WIP branch.
- three-webgl-game: added named mesh groups for hero production bay, asymmetric rock bites, and command pit occlusion/rail posts; kept camera and low-chrome UI stable.
- web-3d-asset-pipeline: introduced blockout module candidates for fabrication machinery, conveyor/cargo, robotic arm, drilled supports, rock contact seams, and pit railing/occlusion.
- game-ui-frontend: not-applicable beyond preserving minimal HUD.
- game-playtest: captured local CDP screenshot and ran visual gate. Verdict: improved, WIP-approved, not ship-ready.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3/5 — stronger asymmetry and shell silhouette, but the top still needs more broken mass and uneven thickness.
Station visibility: 3/5 — command and production reads improved; hero bay still needs larger/clearer manufacturing silhouette.
Lighting/readability: 3/5 — central glow and star corners work; interior depth is still compressed.
Depth/scale: 3/5 — command pit rail/occlusion cues help, but lower-tier depth is not decisive enough yet.

Lighting/readability note:
- Added stronger production accents and pit occlusion details without changing the live/main page. More rim light and rock-to-metal contact shadows are still needed.

Game Studio checklist:
- worked only on `concept-c-wip`.
- kept live/main untouched.
- screenshot captured after changes.
- visual gate says improved and worth saving, but not ship-ready.

What moved closer:
- Left bay now has crane/conveyor/robot arm/cargo/foundry language instead of generic panels.
- Asteroid shell got asymmetric bite chunks and rock-to-metal contact seams.
- Command pit gained rail posts and shadow slots to push depth readability.

What is still off:
- Asteroid mass is still too horizontally slab-like.
- Carved-rock integration needs structures disappearing into stone, not just sitting in front of it.
- Hero production bay is clearer but still too small/secondary.
- Command pit still needs stronger vertical drop and descending access.

Next visual fix:
- Break the top shell harder, enlarge/spotlight the hero production bay, add tunnels/ducts disappearing into rock, and make the command pit visibly lower with foreground lip/stair descent.
