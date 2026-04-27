# Visual Review — 2026-04-27 readability hotfix lighting lock

Commit under review: pending
Screenshot: browser-tool-public-prehotfix-showed-black-crushed-scene-local-browser-policy-blocked
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: lighting
Skill focus: emergency readability recovery for the live WebGL landing frame
Asset pipeline stance: primitive-blockout
Playtest status: screenshot-blocked
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — Asteroid proscenium remains intact. This pass does not add new rock or change border ratio; it prevents the existing border/facility composition from disappearing into black.
Station visibility: 4/5 — Work bays should regain first-frame visibility through stronger hemisphere fill, work-light bars, and witness piers across the facility.
Lighting/readability: 4/5 — Hotfix raises exposure, ambient/hemisphere fill, key/rim/practical lights, fog distance, and adds broad industrial light cards. The intent is to fix black-crush without returning to noisy neon clutter.
Depth/scale: 4/5 — Rear warm silhouette bar, central cyan spine, and rear horizon witness restore layered depth cues that were invisible on the public page.

Lighting/readability note:
- Public page was not truly empty; browser screenshot showed UI and dock loaded, but the WebGL environment was black-crushed into the background.
- Raised `toneMappingExposure` from 0.82 to 1.42.
- Lifted ambient and hemisphere fill substantially.
- Added stronger directional key/rim/practical lights.
- Pushed fog from 12/70 to 24/112 so the production hall is not swallowed immediately.
- Added broad work-light bars and witness piers as readability guarantees, not decorative micro-neon.

Game Studio checklist:
- three-webgl-game: camera/render/material/performance boundaries checked; no renderer migration, no WebGPU stack change.
- web-3d-asset-pipeline: still primitive-blockout; hotfix uses broad modular light/witness forms that can later become GLB work-light modules.
- game-playtest: public browser screenshot confirmed the pre-hotfix failure mode; local screenshot capture remains blocked by policy/headless Chrome hang, so post-push public browser check is required.

What moved closer:
- Restores visible 3D environment instead of a near-blank dark frame.
- Treats Michael's darkness report as a production readability bug.
- Keeps geometry broad and industrial rather than adding sparkle clutter.
- Establishes lighting as part of the Game Studio loop requirements.

What is still off:
- Needs post-push public screenshot confirmation after GitHub Pages deploy catches up.
- Lighting may now need finer artistic balance once the scene is visible again.
- Screenshot capture should be made reliable via Playwright/screenshot tooling instead of browser-policy workarounds.

Next visual fix:
- Verify the deployed page visually, then tune exposure/fill down only if the facility becomes washed out. Do not return to black-crush.
