# Visual Review — 2026-04-28 Concept C bold asymmetry pass

Commit under review: pending WIP
Screenshot: docs/visual-reviews/2026-04-28-concept-c-bold-asymmetry-pass.png
References benchmarked: approved Concept C art direction from Discord, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asset-pipeline | playtest-fix
Skill focus: make the asteroid asymmetry bolder without touching live/main.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — split crown/sill islands, heavy left asteroid masses, lighter/recessed right mass, hanging belly shards, contact shadows, and fractured rock teeth are proxy geometry for future asteroid kit assets.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: focused WIP asymmetry pass; not a live deployment.
- web-game-foundations: render-only scene edits on `concept-c-wip`.
- three-webgl-game: changed asteroid shell polygons/volumes and asymmetric rock chunks while preserving camera and interaction constraints.
- web-3d-asset-pipeline: strengthened modular asteroid shell vocabulary for later high-fidelity GLB work.
- game-ui-frontend: not-applicable; minimal UI untouched.
- game-playtest: captured local CDP screenshot and ran visual gate. Verdict: asymmetry improved/save WIP/not ship-ready.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 3.5/5 — left-heavy/right-recessed intent is now visible; still too much horizontal clam-shell read.
Station visibility: 4/5 — facility zones remain readable after the asymmetry push.
Lighting/readability: 3.5/5 — cyan/gold focal hierarchy still works; left-side mass is darker and more oppressive.
Depth/scale: 3/5 — mass improved, but deeper carved parallax is still needed.

What changed:
- Split the single upper asteroid crown into uneven left/right crown islands.
- Split the lower sill into uneven left-heavy/right-light islands.
- Made the left asteroid wall/crown/belly heavier and uglier.
- Recessed/lightened the right side to reduce bilateral balance.
- Added larger left hanging shards, underside ballast, and heavier contact shadows.

Visual gate summary:
- Concept match: 3.5/5
- Asymmetry/silhouette: 3.5/5
- Asteroid mass: 3.0/5
- Open star corners: 4.0/5
- Carved integration: 3.0/5
- Production readability: 4.0/5
- Pit depth: 3.0/5
- Lighting/materials: 3.5/5
- Overall: ~3.44/5

Gate verdict:
- Asymmetry improved enough for this pass.
- Save WIP.
- Do not ship/live-deploy yet.

Remaining blockers:
- Top and bottom still read as a horizontal clam-shell frame.
- Left side should become even more oppressive in final art pass.
- Right side can be thinned/recessed more deliberately.
- Architecture still needs more rock-swallowed contact.
- Command pit still needs stronger depth/parallax.

Next visual fix:
- Aggressive mass + carved-depth pass: break horizontal bands with a major vertical mass intrusion, add deeper occlusion/voids, and make architecture visibly interrupted by rock rather than framed by it.
