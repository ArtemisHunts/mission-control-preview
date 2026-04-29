# Concept C Hi-Fi Autonomous Loop Prompt

You are Artemis continuing Mission Control Concept C high-fidelity work.

## Working directory and branch
- Repo: `/home/agent-artemis/clawd/mission-control-preview`
- Required branch: `concept-c-hifi`
- `main` is the stable live fallback. Do not merge to `main` or deploy live from this loop unless Michael explicitly asks in a fresh message.
- Push only to `origin/concept-c-hifi`.

## Prime directive
No more blockout. Every iteration must move the scene toward final-form high-fidelity concept art.

Do not make “progress” by adding random primitive boxes or low-poly slab clusters. The only acceptable primitive-like additions are purposeful carriers for higher-density procedural geometry, material systems, post/lighting systems, or temporary scaffolding explicitly replacing an older blockout module.

## Current status
- Stable live baseline is `main` at `4182445 Ship gate Concept C final silhouette pass`.
- Hi-fi branch started at `1b92f0a Start Concept C hifi geometry pipeline`.
- HIFI-01 added browser-native procedural geometry because Blender is not installed in the workspace:
  - `hifiNoise()`
  - `hifiColor()`
  - `hifiPrism()` using custom `BufferGeometry` + vertex colors
  - `buildHifiAsteroidShell()`
  - `buildHifiCommandShaft()`
- HIFI-01 gate verdict: direction approved / fidelity not approved. Overall ~2.9/5.
- HIFI-05 added zoom controls, taller ceiling volume, and 3840x2160 proof, but Michael correctly said it could be much better.
- HIFI-06 added authored macro geology over the noisy density pass: sculpted planes, ravines, strata bands, impact basins, mineral veins, and chunkier rock nodules.
- Current next target: reduce/replace older noisy shell layers behind the HIFI-06 macro geology with cleaner authored crust/mantle/cut-layer systems.


## New poly-density mandate — added after Michael critique
Michael called out that the current hi-fi work is still very low poly count. He is right. From now on, the loop must stop accepting broad faceted procedural chunks as “hi-fi.”

Every new visual pass must materially increase actual geometric richness or material-depth richness. Prefer:
- subdivided/displaced custom `BufferGeometry` surfaces with many vertices, not 8–16 point prisms
- layered fracture networks with small/medium/large crack hierarchy
- bevel/rim geometry around cut faces and apertures
- dense shaft rings, cables, bridge spans, braces, collars, and gantries with real segment counts
- surface detail systems: vertex-color noise, dust/debris clusters, mineral veins, normal-like plane variation
- if a primitive is used, it must be a temporary carrier for a higher-fidelity system, not the final visible form

A pass that only rearranges low-poly slabs, boxes, or cylinders should be treated as a failure, even if composition improves.


## Asteroid-only directive — added after Michael critique
Michael explicitly said: do **not** focus on interior elements yet. He wants an ultra high-fidelity asteroid that we can work from.

Until the asteroid shell itself passes the asteroid-focused gold gate, the loop must spend all effort on the asteroid. Pause all work on:
- command shaft depth
- production bay
- interior props
- collars/braces/conduits around rooms
- HUD/UI changes except camera zoom/view controls Michael requested
- live deploy/cache busts

Allowed work only:
- high-density asteroid mesh generation
- silhouette and massing of the asteroid body
- surface hierarchy: macro authored planes first, medium fracture networks second, micro chips/craters/noise last
- cut-face bevels/rims/strata
- rock material/value richness: vertex color, mineral seams, dust, occlusion, rim lighting
- lighting/post only if it specifically makes the asteroid read more expensive
- cleanup/replacement of older noisy shell layers when they fight authored macro geology

If a pass spends meaningful effort on the interior before the asteroid gate clears, treat it as a failed pass even if the screenshot looks cleaner.


## Reference lock correction — actual target image clarified 2026-04-29
Michael clarified that the active reference is the replied Discord image `1498762634772615373`, now saved as `docs/reference/concept-c-asteroid-cavern-target.png`. The previous oval/portal-style target is archived at `docs/reference/archive/concept-c-asteroid-cavern-target-previous-wrong.png`.

This supersedes the recent oval-portal optimization. Future Concept C hi-fi work must optimize for the actual reference:

1. full asteroid body floating in starfield, not a foreground portal/window
2. large irregular front cutaway exposing the base interior
3. thick grey rocky shell with authored crags, bright top/right rim planes, and dark underside mass
4. layered industrial decks carved into the asteroid
5. central lower circular pit/shaft with ring levels and small blue/cyan lights
6. rear/upper hangar or tunnel opening slightly right of center with cold exterior light
7. cranes, gantries, ramps, platforms, containers, warm work lights, and tiny scale lights
8. thumbnail read: complete asteroid cutaway base first, facility detail second

A pass fails if it preserves a clean perfect oval aperture/ring as the dominant composition. Stop decorating the oval. Rebuild the asteroid body/cutaway silhouette.


## Gold-standard target
High-fidelity Concept C asteroid cavern reference match first:
- massive hollow asteroid body must read like the supplied reference at thumbnail scale
- full asteroid exterior silhouette frames the carved-open base
- embedded industrial facility inside the hollow, not a toy cutaway in front of panels
- rear/upper hangar or tunnel opening inside the asteroid
- visible starfield around/behind the asteroid and through openings
- central circular pit/shaft with blue glow and real ring depth
- cinematic material richness focused on broad sculpted dark crust, strata/ridges, chipped rims, craters, rubble, dust, and mineral variation

Gold-standard gate:
- visual gate average >= 4.5/5
- no category below 4.0/5 across concept match, asteroid shell fidelity, material richness, carved integration, command shaft depth, production/facility fidelity, lighting/depth, performance/readiness
- if this is achieved, write `HIFI_GOLD_STANDARD` to the done file specified by the Ralph runner.

## Required sequence every iteration
1. `cd /home/agent-artemis/clawd/mission-control-preview`
2. Verify branch and state:
   - `git branch --show-current`
   - `git status --short`
   - `git log --oneline -3`
3. If branch is not `concept-c-hifi`, stop and report the blocker. Do not work on `main`.
4. Read the current hifi docs/reviews:
   - `docs/concept-c-hifi-pipeline.md`
   - latest `docs/visual-reviews/*hifi*.md`
5. Pick exactly one coherent hi-fi thesis from the priority ladder below.
6. Write a pre-code Game Studio application note into the visual review draft before editing runtime files.
7. Implement the pass.
8. Smoke test:
   - `node --check --input-type=module < app.js`
   - `git diff --check`
9. Capture a screenshot using local server/CDP/browser tooling when available.
   - Prefer the direct CDP screenshot pattern used by prior successful manual passes.
   - Do **not** rely on Canvas tooling as the only path; if Canvas/browser policy fails, fall back to direct CDP or record a screenshot blocker.
   - A screenshot-tool failure is not a full loop failure if code checks pass, a real blocker is documented, and the commit is useful.
10. Run a visual gate against gold-standard Concept C when a screenshot exists. If no screenshot exists, write a provisional review and make screenshot recovery the next task.
11. Write a visual review markdown file with scores and next target.
12. Commit and push to `origin/concept-c-hifi`.
13. Reply/record concise status only if the environment asks; otherwise leave durable evidence in docs and git.

## Hi-fi priority ladder
Work down this ladder. Do not resume interior work until the asteroid itself clears gate.

1. REF-01 reference composition rebuild
   - create full asteroid body silhouette and irregular carved front cutaway matching the supplied target image
   - hollow cavern must dominate the silhouette
   - rear/upper hangar or tunnel opening inside the asteroid
   - central circular pit and embedded industrial city visible inside

2. REF-02 cavern depth and lighting
   - foreground black rock, mid facility, rear cavern, bright exterior openings
   - cyan left bay, warm amber core, blue central pit glow
   - cranes/bridges/gantries/tiny lights for scale

3. AST-01 high-density asteroid mesh foundation
   - replace low-poly mantle prisms with subdivided/displaced custom BufferGeometry
   - use enough vertices/faces to remove the folded-paper read
   - create macro asymmetry and real surface undulation without closing star corners

4. AST-02 surface fracture hierarchy
   - large breaks, medium fracture networks, small chips/craters/rubble
   - geometry or dense procedural detail, not just accent strips
   - chipped bevel/rim geometry around cut faces

5. AST-03 rock material/value richness
   - stronger vertex-color strata and mineral variation
   - dust/debris pockets, darker underside occlusion, cool recesses, warm exposed cuts
   - selective rim lighting/post only where it sells asteroid mass

6. AST-04 authored macro geology pass
   - large sculpted planes, ravines, impact basins, sediment strata, and worn surfaces must dominate before micro detail
   - if the asteroid reads as procedural noise soup, the pass fails regardless of vertex count

7. AST-05 reference/asteroid visual gate
   - compare against gold-standard concept art as a standalone asteroid shell
   - do not grade up because the interior is readable
   - if asteroid is still low-poly or noisy/procedural, repeat AST-01/02/03/04

8. Interior detail resumes only after the full asteroid cutaway reads correctly at thumbnail scale and asteroid-focused gate >= 4.5/5 with no asteroid category below 4.0.

## Zoom/view exception
Michael requested zoom in/out and a taller ceiling. Camera/view controls are allowed even while unrelated HUD/UI polish remains paused. Older asteroid screenshots were 1600x900; HIFI-05 proof should prefer a 3840x2160 full-frame capture when the browser can hold it.

## Hard rules
- Do not work on command shaft, production bay, interior props, collars, braces, conduits, or UI until asteroid-only gate clears.
- Do not touch `main`.
- Do not deploy live.
- Do not edit workspace bootstrap files (`MEMORY.md`, `DREAMS.md`, `SOUL.md`, `TOOLS.md`, `AGENTS.md`).
- Do not report placeholder progress.
- No commit unless the screenshot/gate exists or a real blocker is documented.
- Do not throw/exit the whole job as failed solely because Canvas/browser screenshot capture failed after useful code/checks/commit work. Document it as a blocker and keep the loop moving.
- No random prop/noodle pass. Every edit must serve the chosen thesis.
- If a pass makes the scene worse, revert or document honestly and do not claim improvement.

## Completion
Only write the done signal if the gold-standard gate passes.
