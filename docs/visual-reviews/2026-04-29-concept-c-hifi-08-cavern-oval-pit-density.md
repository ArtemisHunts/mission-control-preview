# Visual Review — 2026-04-29 Concept C HIFI-08 cavern oval + pit density

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-08-cavern-oval-pit-density.png`
References benchmarked: `docs/reference/concept-c-asteroid-cavern-target.png`, `docs/reference/concept-c-asteroid-cavern-target.md`, `docs/loops/concept-c-hifi-loop-prompt.md`, `docs/visual-reviews/2026-04-28-concept-c-hifi-07-reference-composition-rebuild.md`
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | cavern-depth | facility-density
Skill focus: REF-02 cavern depth and lighting while preserving REF-01 composition intent.
Asset pipeline stance: modular-GLB-planned
Playtest status: screenshot-captured

Pre-code Game Studio application:
- game-studio: HIFI-07 still failed the thumbnail test. This pass was about forcing a more oval aperture read, a deeper center drop, and a clearer right-side opening before any more local rock vanity work.
- web-game-foundations: keep the branch stable and scene-driven while reallocating geometry away from flat slit framing and toward a single cavern silhouette.
- three-webgl-game: widen the aperture vertically, deepen the circular pit, increase visible ring density, and push the hangar/window read harder.
- web-3d-asset-pipeline: use denser modular decks, rings, braces, and masks as temporary carriers for the reference composition instead of pretending the earlier sparse cutaway was close.
- game-ui-frontend: preserve camera controls only; no unrelated UI work.
- game-playtest: smoke-test, capture a fresh screenshot, and grade it brutally against the supplied reference.

North-star question: does the screenshot now read like a hollow asteroid city framed by a dark oval aperture with a deeper glowing center and a large right-side opening?
North-star verdict: slightly closer on the aperture silhouette, still well short of the reference

## What changed
- Fixed the broken HIFI-08 runtime scene draft and got the new pass rendering again.
- Retuned camera distance/FOV so the frame stops crowding the aperture quite as badly.
- Raised exposure and expanded the reference lighting stack to help the city/pit survive the heavy rock frame.
- Reworked the foreground cavern shell again:
  - pulled the top/bottom/side framing farther toward an oval aperture read
  - pushed several foreground rock masses back so they stop acting like a flat horizontal slot
  - moved the rear roof blocker farther back to free more center void
  - enlarged the rear black depth wall / void pockets
- Deepened the circular pit stack:
  - larger outer ring
  - more ring levels
  - taller core glow
  - more vertical braces
  - added terrace-like ring wall segments for denser center read
- Enlarged the left cyan bay / warm core / right hangar decks and glow planes so the facility has a bit more silhouette mass.
- Bumped the cache-bust string and captured a fresh post-pass screenshot through direct CDP to a durable file.

## Screenshot / gate notes
- Local static preview served from `http://127.0.0.1:4173/`.
- Smoke checks passed before capture:
  - `node --check --input-type=module < app.js`
  - `git diff --check`
- Fresh screenshot captured through direct CDP and written to:
  - `docs/visual-reviews/2026-04-29-concept-c-hifi-08-cavern-oval-pit-density.png`

## Gate scores
Concept match: **2.3/5** — the frame now hints at a dark oval aperture instead of a pure slit, but it still does not trigger the supplied concept at thumbnail scale.
Asteroid shell fidelity: **2.2/5** — the shell is more compositionally useful, yet still reads as coarse procedural chunks instead of one massive sculpted hollow asteroid body.
Material richness: **1.8/5** — the pass did not solve the flat, under-separated material read; most of the city still collapses into dark slabs.
Carved integration: **2.1/5** — slightly better because the aperture and city are less detached, but the facility still feels parked inside a void more than excavated into rock.
Command shaft / central pit depth: **2.4/5** — extra ring density and deeper glow help, though it still lacks the dramatic excavated drop of the reference.
Production / facility fidelity: **1.8/5** — more decks and rings exist, but the scene is still nowhere near the layered industrial density, cranes, and lived-in complexity of the target.
Lighting / depth: **2.0/5** — brighter than the previous failing frame, but still too dim and too black through the middle to sell the cavern volume.
Performance / readiness: **3.3/5** — code checks passed, screenshot captured, branch remained stable.

Overall visual gate: **2.2/5**

## What moved closer
- The aperture reads a little more like an enclosing oval cavern instead of only a horizontal rock slit.
- The central pit has more ring hierarchy and a stronger vertical drop cue than HIFI-07.
- The right opening survives the frame more clearly than before.
- The screenshot is at least grading against composition now, not hiding behind rock-detail busywork.

## What is still off
- It still does **not** read like the reference image at first glance.
- The city mass is too thin, too flat, and too dark.
- The right-side hangar/window is present but not convincingly giant or spatially integrated.
- The rock frame still feels like separated chunks around a view, not one enormous hollow asteroid shell.
- The center pit is deeper than before, but still not a dramatic excavated industrial chasm.
- Starfield / exterior-space presence is too weak relative to the reference.

## Honest verdict
Useful pass, still failing pass.

This was the right direction relative to Michael’s critique because it kept attacking composition, not local texture cosmetics. But the screenshot is still far from the supplied target. The scene now says:

- “dark framed cavern prototype with a center pit”

more than:

- “cinematic massive hollow asteroid industrial city.”

That distinction matters.

## Game Studio checklist
- [x] Pre-code skill application recorded before runtime edits.
- [x] Exactly one thesis chosen: REF-02 cavern depth and lighting while preserving REF-01 composition intent.
- [x] Runtime scene path updated around that thesis.
- [x] `node --check --input-type=module < app.js` passed.
- [x] `git diff --check` passed.
- [x] Screenshot captured.
- [x] Honest gate recorded.
- [ ] Gold-standard reference gate achieved.

## Next visual fix
Stay on reference-match composition. Do not waste the next loop on micro rock polish.

Next pass should:
1. replace the chunky foreground side pieces with a more continuous single-shell oval frame,
2. build a genuinely massive right-side hangar/window opening with exterior space read behind it,
3. turn the center into a deeper bowl/chasm with layered descending decks, not a flat platform over a glow bulb,
4. massively increase visible industrial density and brightness in the left bay / warm core / rear city,
5. preserve starfield and exterior negative space so the cavern feels hollow, not boxed in.
