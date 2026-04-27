# Visual Review — 2026-04-26 exterior-prune-runtime-cleanup

Commit under review: pending
Screenshot: blocked-local-current-build
Screenshot blocker: Screenshot capture is still blocked. The pass attempted local `google-chrome --headless --screenshot` against the static server after the performance cleanup, but the browser session was SIGTERM'd before `/tmp/mc-corrective2-shot.png` was produced. Local marker curl did verify the updated app bundle. Production URL to verify after push: https://artemishunts.github.io/mission-control-preview/
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid border ratio is now enforced structurally: the old pebble-ring/jagged exterior generators were replaced by slim proscenium slabs, broad side cut faces, a restrained crown, and a narrow sill. Target remains ~15–25% asteroid/comet border.
Station visibility: 4/5 — Interior facility dominance is stronger because the noisy rock rings and panel-grid clutter no longer compete with the production floor. Build/Review/Observatory/Deploy now sit inside a cleaner dominant floor/wall/mezzanine composition.
Lighting/readability: 4/5 — Simplifying the rock border and floor panel noise leaves the existing bay headers, deck lanes, ceiling practicals, holo-table glow, and rear rim light with less visual competition.
Depth/scale: 4/5 — Broad decks, rear production gantry, interior mezzanine balcony masses, rear wall/glass, and clean proscenium side cuts now carry depth/scale with large readable architecture rather than hundreds of micro rocks/panels.
FPS/performance risk: 5/5 — Major risk reduction. app.js dropped from about 2541 lines to 1288 lines, `new THREE.Mesh` constructors dropped from 65 to 33, and procedural loop markers dropped from 47 to 5. The floor panel grid and dead exterior/deck-ring generator code were pruned.

What moved closer:
- Removed legacy exterior/deck-ring function bodies from the codebase instead of merely leaving them dormant.
- Replaced the noisy asteroid rim/cave/cutaway loops with a few large border/proscenium masses.
- Replaced the expensive floor-panel grid and edge lines with broad production deck plates.
- Added large interior mezzanine/gantry masses so the production facility reads as the subject.
- Preserved asteroid context as a carved border, not the hero object.

What is still off:
- Screenshot capture remains blocked, so exact frame ratio must be verified in browser/Pages after deploy.
- A future visual pass should tune the camera/border thickness by eye once a screenshot path is reliable.
- Some small interior set dressing remains; it is acceptable now, but the next visible pass should keep resisting greeble creep.

Next visual fix:
- Verify deployed frame visually, then adjust camera/FOV/proscenium thickness until asteroid is visibly 15–25% and interior facility is 75–85% of the screenshot.
