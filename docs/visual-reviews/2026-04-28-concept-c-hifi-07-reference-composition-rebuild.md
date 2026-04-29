# Visual Review — 2026-04-28 Concept C HIFI-07 reference composition rebuild

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-28-concept-c-hifi-07-reference-composition-rebuild.png`
References benchmarked: `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, `docs/loops/concept-c-hifi-loop-prompt.md`, HIFI-06 review set.
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | asteroid-shell | facility-massing
Skill focus: REF-01 reference composition rebuild — dark oval aperture, single hollow cavern, right hangar/window, embedded city, central blue pit.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: Michael is right; the current frame still reads like a procedural cutaway, not the supplied cavern shot. This pass only counts if the thumbnail composition starts reminding us of the reference immediately.
- web-game-foundations: keep the scene stable, but re-aim the whole frame around one giant hollow asteroid cavern instead of layered shell clutter.
- three-webgl-game: spend geometry budget on the silhouette and interior cavity read first — dark oval foreground rock, huge right-side opening, and a deeper circular center pit.
- web-3d-asset-pipeline: treat old HIFI shell/interior modules as scaffolding if they fight the new massing; replace or suppress them rather than polishing them.
- game-ui-frontend: not applicable beyond preserving the existing zoom controls.
- game-playtest: capture a real post-pass screenshot through direct CDP, then score concept match honestly against the reference instead of grading up for local rock detail.

North-star question: does the screenshot read like one massive asteroid cavern framed by dark foreground rock with a giant right-side hangar to space?
North-star verdict: more like the target than the previous flat cutaway, still clearly short of the reference gate

## What changed
- Rebuilt the active scene path around a new HIFI-07 reference-match composition instead of the old HIFI-06 cutaway stack.
- Retuned the default camera presets for a lower, more cavern-facing view.
- Added a new reference-specific lighting stack:
  - stronger cold space light from the right opening
  - brighter cyan pit/core glow
  - clearer warm amber industrial core light
  - softer ambient/hemisphere fill so the scene stops collapsing into pure black
- Added a new HIFI-07 starfield and distant exterior asteroid read beyond the right-side opening.
- Built a new foreground asteroid aperture shell with composition-first geometry:
  - heavy top arch
  - left/right cavern cheeks
  - lower sill
  - rear roof mass
  - right hangar lip
  - extra foreground shadow masks to force the dark aperture framing read
- Built a new embedded industrial city massing pass:
  - larger circular central deck and pit stack
  - left cyan bay terraces
  - warm amber industrial core tower/foundry block
  - right hangar apron leading toward the bright space opening
  - bridges, crane span, light runs, haze cards, and tiny scale markers
- Updated the readout copy and cache-bust string so the screenshot definitely exercised the new scene path.

## Screenshot / gate notes
- Local static preview served from `http://127.0.0.1:4173/`.
- Smoke checks passed before capture:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Fresh screenshot captured through direct CDP against the host browser on port `18800`.
- Durable proof saved at 2560x1440: `docs/visual-reviews/2026-04-28-concept-c-hifi-07-reference-composition-rebuild.png`.

## Gate scores
Concept match: **2.0/5** — this finally reads as a cavern framing a facility instead of a top-down asteroid pancake, but the thumbnail still does not really echo the supplied reference.
Asteroid shell fidelity: **2.4/5** — there is now a bigger enclosing shell and a real aperture idea, but the rock still reads like noisy procedural plates instead of a massive sculpted oval asteroid body.
Material richness: **1.8/5** — warm/cool zones improved, but the facility is still mostly black slabs with limited material separation.
Carved integration: **2.1/5** — the city is more embedded than before, though it still feels placed into a cave rather than excavated into rock.
Command shaft / central pit depth: **1.8/5** — the blue core and circular ring cue are present, but it still reads shallow and too table-like.
Production / facility fidelity: **1.9/5** — there is a recognizable left bay / warm core / right hangar structure now, but nowhere near the density of cranes, gantries, decks, and tiny industrial reads in the reference.
Lighting / depth: **2.0/5** — less crushed than the first HIFI-07 capture, yet still too dim and too flat through the middle band.
Performance / readiness: **3.2/5** — new scene path rendered, syntax/diff gates passed, screenshot captured, and the branch stayed stable.

Overall visual gate: **2.2/5**

## What moved closer
- The scene no longer reads like the earlier flat sliced asteroid pancake. That part is real progress.
- The dark foreground aperture idea is now on-screen instead of only implied in the plan.
- The right-side bright hangar/window read exists and helps the composition anchor to the reference instead of pure interior cutaway language.
- The frame now has three intended zones: left cyan bay, warm central core, and bright right opening.
- The central blue feature is closer to a pit/reactor read than the prior generic center platform.

## What is still off
- The opening is still a **horizontal slit**, not the big cinematic oval cavity from the reference.
- The top foreground rock is still too dominant; it compresses the frame instead of elegantly framing it.
- The facility is still too sparse. The reference has dense layered industrial life; this still looks like an early massing pass.
- The central pit still lacks convincing vertical drop, ring depth, lower levels, and bridge hierarchy.
- The rock surface has more presence, but it still looks like uniform procedural noise instead of authored dark sculpted crust.
- The image still needs stronger value separation: brighter city decks, clearer warm practical pools, and more readable cool fill in the left bay.

## Honest verdict
This pass **does** address Michael’s core critique more honestly than the previous state because it attacks the composition itself instead of pretending local rock polish solved the problem.

But it is still a failing reference-match gate.

The screenshot is now saying:
- “dark asteroid cavern with a facility inside”

instead of:
- “flat asteroid cutaway diorama.”

That is better. It is not enough.

## Game Studio checklist
- [x] Pre-code skill application recorded before runtime edits.
- [x] Exactly one thesis chosen: REF-01 reference composition rebuild.
- [x] Runtime scene path rebuilt around the new thesis.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest gate recorded.
- [ ] Gold-standard reference gate achieved.

## Next visual fix
Stay on REF-01/REF-02. Do not go back to local texture vanity work.

Next pass should specifically:
1. open the aperture vertically into a clearer oval cavern frame,
2. turn the center into a real deep circular pit with stacked ring levels and bridges,
3. massively increase visible industrial density in the left bay / warm core / right hangar,
4. brighten the facility enough that the composition reads at thumbnail scale,
5. keep the rock broad and sculptural instead of reintroducing noisy procedural soup.
