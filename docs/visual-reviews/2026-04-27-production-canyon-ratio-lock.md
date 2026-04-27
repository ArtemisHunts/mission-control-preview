# Visual Review — 2026-04-27 production-canyon-ratio-lock

Commit under review: pending
Screenshot: blocked-local-current-build
Screenshot blocker: Current local-build screenshot capture is blocked. Browser navigation to local static preview is blocked by policy, and prior browser screenshot attempts timed out through the gateway. Production URL to verify after push: https://artemishunts.github.io/mission-control-preview/
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 5/5 — The asteroid/comet stays constrained to the perimeter and a reduced rear slit, while the new production canyon hierarchy, tighter camera/FOV, and overhead/foreground occlusion plates push the read toward an 80% interior facility / 20% border composition.
Station visibility: 4/5 — The command floor now has a clearer interior hierarchy: central command spine, stepped amphitheater tiers for station zones, sidewall machinery masses, transverse gantries, and foreground floor occluders. Stations should read as embedded in one production plant rather than spread across exterior-adjacent scenery.
Lighting/readability: 4/5 — Animated haze was replaced with static broad readability washes. Cyan/amber light lanes now sit on big structure: command spine, gantries, tiers, lower logistics floors, and rear slit. This should improve hierarchy without adding noisy small emitters.
Depth/scale: 5/5 — The production canyon adds visible lower logistics floors, transverse gantries, sidewall stacked machinery, rear sealed shutter, and foreground/mid/rear occluders. Depth is carried by large interior layers, not exterior deck-ring language.
FPS/performance risk: 5/5 — Positive. Mesh constructors dropped to 26, loop markers remain 3, app lines remain far under budget at 1494, FOV/fog were tightened, and animated volumetric planes were replaced by static box-based light zones.

What moved closer:
- Added `buildInteriorProductionCanyonHierarchy()` as a single large interior hierarchy element.
- Camera/FOV/fog/fixed offset were tightened toward an interior-first hero shot.
- Replaced animated volumetric plane haze with static broad readability washes.
- Added central command spine, stepped station tiers, transverse gantries, sidewall machinery, lower logistics floors, and rear aperture reduction.
- Added overhead and foreground occlusion plates to keep the asteroid as border/context.

What is still off:
- Exact asteroid/interior percentage still needs a real deployed screenshot inspection.
- If the deployed frame misses the ratio, the next pass should be pure camera/proscenium tuning based on screenshot evidence.

Next visual fix:
- Capture the deployed page and tune camera/FOV/proscenium thickness against the real 15–25% asteroid / 75–85% interior target.
