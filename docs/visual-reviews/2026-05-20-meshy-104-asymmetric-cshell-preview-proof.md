# Meshy-104 Asymmetric C-Shell Preview Proof - 2026-05-20

## Scope

Goal 6 only. This pass submitted exactly one approved Meshy preview task from the Meshy-104 asymmetric C-shell pack, then inspected the result in Blender. It does not accept the asteroid baseline and does not unblock facility population.

## Meshy Task

- Submit script: `scripts/submit-meshy-104-asymmetric-cshell-v1.py --submit`
- Task id: `019e4578-65f4-7a94-9ac0-875642f889f5`
- Status: `SUCCEEDED`
- Consumed credits: `20`
- Source GLB: `assets/meshy/api/104-asymmetric-broken-c-shell-asteroid-v1.meshy.glb`
- Thumbnail: `assets/meshy/api/104-asymmetric-broken-c-shell-asteroid-v1.thumbnail.png`
- Task JSON: `assets/meshy/api/104-asymmetric-broken-c-shell-asteroid-v1.task.json`

## Blender/glTF Inspection

- Inspection script: `scripts/render-meshy-102-thinwall-preview-proof.py`
- Inspection blend: `assets/blender/meshy-104-asymmetric-cshell-preview-inspection.blend`
- Render proof: `docs/visual-reviews/2026-05-20-meshy-104-asymmetric-cshell-preview-proof.png`
- Proof board: `docs/visual-reviews/2026-05-20-meshy-104-asymmetric-cshell-preview-board.png`
- Metrics JSON: `docs/visual-reviews/2026-05-20-meshy-104-asymmetric-cshell-preview-proof.json`
- Source size: `10,404,128` bytes
- Imported mesh: `1` mesh object, `288,986` vertices, `577,960` triangles
- Imported bounds: `1.8988 x 1.8228 x 1.8623`
- glTF extensions: none used / none required
- Materials/textures: none

## Visual Verdict

Decision: **failed visual acceptance**.

Reasons:

- Meshy-104 avoided some pure tube symmetry, but still does not clearly read as an asymmetrical broken C-shaped asteroid shell.
- The cavity exists but is shadowed/occluded and not clearly usable as a future facility volume.
- Several shell surfaces remain too thick, rounded, and smoothed for the thin torn-wall acceptance bar.
- A smooth lower-right surface still reads like a slab/floor or cut plane.
- Geological detail remains weak; several curved bands feel artificial/panel-like rather than fractured layered rock.

## Spend / Ledger

- Spend delta this loop: `20` credits.
- Direct task-json recompute after this pass: `104` paid task files, `2200` total consumed credits.

## Next Gate

Do not normalize/export Meshy-104 as the accepted baseline and do not populate facility assets from it. The next Goal 6 unblock is either a stronger Meshy prompt/refine pass that makes the broken C-shell silhouette unmistakable, or a deliberate stop/re-scope if further Meshy form attempts keep converging on thick smooth shells.

## Runtime Guard Smoke

The protected clean Meshy-101 runtime baseline still loads while Meshy-104 remains rejected:

- URL: `http://127.0.0.1:4192/?camera=detail`
- Runtime GLB: `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`
- GLB HTTP result: `200 OK`, `model/gltf-binary`, `6562104` bytes
- Screenshot: `docs/visual-reviews/2026-05-20-meshy-104-final-runtime-guard-smoke.png`
- Pixel sanity: `1600x1000`, `5499` unique colors, `453` bright pixels, `2477` cyan pixels

## Verification

- `python3 scripts/submit-meshy-104-asymmetric-cshell-v1.py`
- `python3 -m py_compile scripts/submit-meshy-104-asymmetric-cshell-v1.py`
- `python3 scripts/submit-meshy-104-asymmetric-cshell-v1.py --task-id 019e4578-65f4-7a94-9ac0-875642f889f5`
- `blender --background --factory-startup --python scripts/render-meshy-102-thinwall-preview-proof.py`
- `npx --yes @gltf-transform/cli inspect assets/meshy/api/104-asymmetric-broken-c-shell-asteroid-v1.meshy.glb`
- local Chrome runtime guard screenshot at `?camera=detail`
- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
