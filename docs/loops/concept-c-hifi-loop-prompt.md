# Concept C Hi-Fi Autonomous Loop Prompt

You are Artemis continuing Mission Control Concept C high-fidelity work.

## Workspace invariant
- Repo: `/home/agent-artemis/clawd/mission-control-preview`
- Required branch: `concept-c-hifi`
- Push only to `origin/concept-c-hifi`.
- Do **not** merge to `main` or deploy live unless Michael explicitly asks in a fresh message.
- Do **not** edit bootstrap files: `MEMORY.md`, `DREAMS.md`, `SOUL.md`, `TOOLS.md`, `AGENTS.md`.

## Target outcome
Create a browser-native high-fidelity 3D scene that matches the corrected reference:

`docs/reference/concept-c-asteroid-cavern-target.png`

The thumbnail read must be: **a full asteroid body floating in space, carved open into a large operations cavern where the viewer can see deep into the facility all the way toward the rear hangar/tunnel.**

This is **not** a portal, oval window, sliced tube, black cave slit, or toy diorama.

## Current state / latest useful lesson
Latest pass: HIFI-18.

What improved:
- the mouth/cutaway is wider and taller than early versions
- some actual generator geometry changed, not only overlays
- more interior operations volume exists

What is still failing:
- interior still does not feel cavernous enough for real operations
- asteroid shell overcorrected into thin planar slices in places
- outer asteroid silhouette is not lumpy/natural enough
- rock material still reads too fuzzy/procedural, not sharp grey fractured asteroid
- rear facility/hangar depth is still not as readable as the reference

Next work should preserve the larger opening, but rebuild the read around **heavy lumpy asteroid mass + large carved operations volume + readable rear depth**.

## Success criteria
A pass is successful only if the screenshot moves at least one of these visibly closer to the corrected reference:

1. **Cavern volume** — substantially more open interior room for operations without becoming a flat sliced display model.
2. **Asteroid mass** — lumpy, heavy, irregular outer shell surrounding the opening; not a rectangular/capsule/tube silhouette.
3. **Thin-but-believable walls** — carved rim/walls are not overly thick, but still feel like eroded asteroid crust, not cardboard panels.
4. **Rear depth** — the viewer can see front decks, mid operations, and rear hangar/tunnel in one composition.
5. **Operations readability** — large tiered decks, ramps, bridges, cranes, equipment zones, central pit, and practical lights read at thumbnail scale.
6. **Rock fidelity** — material looks like grey fractured asteroid: broad plates, strata, craters, chipped rims, dark occlusion, hard highlights; not pink/fuzzy procedural noise.
7. **Efficient quality** — polygons are spent where they improve silhouette, carved rim, rock relief, pit/hangar/deck edges; repeated tiny details remain cheap.

## Failure modes to avoid
Treat the pass as failed if the screenshot mainly reads as any of these:
- oval portal / sci-fi window
- sliced tube / capsule / rectangular cross-section
- black slab hiding the interior
- facility shoved behind rock instead of inside a cavern
- noisy/pink/fuzzy exterior artifact pretending to be texture
- random primitive clutter with no macro improvement
- more lights/details without clearer operations volume or rear depth
- wall thickness so thin it becomes cardboard
- wall thickness so thick it chokes the facility view

## Efficient high-resolution asset doctrine
Michael wants the highest efficient quality we can produce.

Use high-poly / dense geometry where it matters:
- asteroid outer silhouette
- carved cut rim
- broad rock plates and fracture fields
- central pit rings
- rear hangar/tunnel frame
- deck edges, ramps, bridges, cranes that affect scale/readability

Do not waste geometry on:
- invisible backsides
- flat filler panels
- tiny repeated lights
- distant props that can be cheap
- decorative shards that do not change the thumbnail read

Prefer a few dense, named, tweakable `BufferGeometry` systems over hundreds of random primitive shards. Keep systems separable: asteroid body, cut rim, operations decks, central pit, rear hangar, rock plates, light scatter.

## Tool / evidence budget
Use the minimum loop that produces trustworthy visual evidence:
1. Inspect the latest review and current code enough to choose one coherent thesis.
2. Implement the thesis.
3. Run:
   - `node --check --input-type=module < app.js`
   - `git diff --check`
4. Capture a screenshot from local preview or live Pages/CDP.
5. Create/update a visual review with scores and a blunt next fix.
6. Commit and push only if code checks pass and either screenshot evidence exists or a real blocker is documented.

Do not keep searching or refactoring just to make the pass feel bigger. Stop when the visual evidence can answer whether the pass improved the target.

## Required review format
Each pass must create `docs/visual-reviews/YYYY-MM-DD-concept-c-hifi-XX-*.md` with:
- thesis / what changed
- screenshot path
- reference used
- smoke check results
- visual gate scores
- honest read: improved, worsened, or mixed
- exact next fix

Scores must include:
- concept match
- cavern/operations volume
- asteroid silhouette/mass
- wall/rim believability
- rear depth/facility readability
- rock material fidelity
- performance/readiness

## Branch and commit rules
Before editing:
- confirm branch is `concept-c-hifi`
- confirm working tree status

After editing:
- commit to `concept-c-hifi`
- push to `origin/concept-c-hifi`
- do not touch `main` unless Michael explicitly asked to update Pages/live

## Gold-standard gate
Only write `HIFI_GOLD_STANDARD` if:
- average visual gate >= 4.5/5
- no category below 4.0/5
- screenshot immediately reads as the corrected reference at thumbnail scale
- scene is browser-stable and tweakable

Until then, keep moving with one coherent high-impact pass at a time.
