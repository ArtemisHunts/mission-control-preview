# Visual Review — 2026-04-28 approved asteroid shell first framing

Commit under review: pending
Screenshot: docs/visual-reviews/2026-04-28-approved-asteroid-shell-first-framing.png
Proof screenshot before edit: live HTML/app version proof via curl; local post-change CDP screenshot captured.
References benchmarked: approved Discord concept art direction, docs/target-design-spec.md, docs/moodboards/north-star-asteroid-operations-floor.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | playtest-fix
Skill focus: reset the default macro composition so the asteroid shell is the primary frame, open starfield corners remain visible, and the production facility reads as carved into the interior cavity.
Asset pipeline stance: primitive-blockout | modular-GLB-planned — asteroid shell lobes, chipped cut faces, cavity shadows, and retained industrial lips are blockouts for a future high-fidelity asteroid/cutaway kit.
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael approved the asteroid-shell-first concept direction. The pass should move at the macro-frame level, not add another decorative micro-layer.
- web-game-foundations: render-only scene update; no routing, state, HUD interaction, persistence, or input changes.
- three-webgl-game: preserve the command pit and production-floor hierarchy while adding a larger irregular asteroid silhouette, brighter starfield corner reads, rough cut faces, and a slightly wider/higher overview camera/fog range.
- web-3d-asset-pipeline: treat all new rock lobes/cut faces as primitive blockout proxies for later GLB/proxy asteroid-shell modules with craters, strata, chipped rims, and retained industrial inserts.
- game-ui-frontend: not-applicable — no DOM UI, dock controls, labels, or copy presentation changed beyond the overview readout body.
- game-playtest: proved current live app version before edit, captured local post-change CDP screenshot at 1600x900, and compared against the approved direction for 85% asteroid frame, visible open-space corners, carved facility read, station visibility, lighting, and scale.

Live proof before edit:
- Deployed HTML before edit loaded `app.js?v=verified-sunken-command-arena-20260428`.
- Deployed app.js was reachable, SHA prefix `33de64ee21cc`, and contained `buildVerifiedSunkenCommandArena`.

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — the asteroid now owns the default composition as a macro shell rather than a thin proscenium. Open starfield corners are visible; shell needs richer rocky surface detail next.
Station visibility: 4/5 — the central command floor, holo-table, and surrounding platforms remain readable inside the carved cavity, though some side bay activity is still dark.
Lighting/readability: 3/5 — central focal lighting is strong and the shell silhouette is clear; outer rock and lower corners still need better readable rim/detail without flattening the mood.
Depth/scale: 4/5 — bigger side shoulders, upper crown, foreground sill, cavity shadows, starfield, and higher/farther camera sell a hollow asteroid around the facility.

Lighting/readability note:
- Increased the starfield density/size and added a cool cavity fill so the corners read as exterior space while the production floor stays the focal interior.

Game Studio checklist:
- pre-code skill application followed; this is a macro composition reset from approved art direction, not another incremental prop pass.
- three-webgl-game: added named asteroid-shell-first runtime marker, deterministic starfield points, low-poly shell lobes, rough cut faces, and camera/fog adjustment. Syntax and diff checks passed.
- web-3d-asset-pipeline: primitive rock-lobe/cut-face forms are explicitly named as future asteroid-shell kit proxies.
- game-playtest: local CDP screenshot captured with canvas loaded and app cache-bust `approved-asteroid-shell-first-framing-20260428`; visual assessment says honestly closer.

What moved closer:
- Default view now reads outside-in: asteroid shell first, facility carved inside second.
- Corners show open starfield instead of a sealed rectangular room.
- The facility still stays visible, so the macro frame did not bury the playable/readable production floor.

What is still off:
- Rock material is still primitive and too smooth/dark in places.
- Side production bays need selective light/detail after the macro frame is accepted.
- The shell needs proper crater/strata/chipped-rim GLB/proxy quality to stop feeling like scaled primitives.

Next visual fix:
- Replace the primitive shell lobes with a stronger modular asteroid-cutaway kit: jagged inner rims, strata bands, craters, retained metal collars, and better side-cavity rim lighting while keeping open star corners.
