# Meshy-108 High-Fidelity C-Shell Detail Pass

Date: 2026-05-20
Lane: Goal 6 - high-fidelity asteroid baseline
Spend: none
Decision: Passed high-fidelity baseline-candidate gate; runtime-scale/collision acceptance remains before facility population.

## Gap Picked

Meshy-107 solved the topology problem but was explicitly not high-fidelity final art. This pass took the next Goal 6 unblock: a no-spend fracture/detail/material pass that preserves the open C-shell silhouette while making the asteroid read less like a simple topology blockout.

## Outputs

- Script: `scripts/create-meshy-108-hifi-cshell-detail-v1.py`
- Blender source: `assets/blender/meshy-108-hifi-cshell-detail-v1.blend`
- Runtime GLB: `assets/blender/meshy-108-hifi-cshell-detail-v1.glb`
- Metrics: `docs/visual-reviews/2026-05-20-meshy-108-hifi-cshell-detail-v1.json`
- Board: `docs/visual-reviews/2026-05-20-meshy-108-hifi-cshell-detail-board.png`
- Renders: `docs/visual-reviews/meshy-108-hifi-cshell-detail-v1/`
- Runtime smoke: `docs/visual-reviews/2026-05-20-meshy-108-hifi-cshell-runtime-smoke.png`

## Inspection

- GLB is valid glTF 2.0.
- Exported as 193 nodes / 193 meshes, 13,372 vertices, 14,212 polygons, 4 GLB materials, and no textures.
- The app now supports `?asteroid=108` as an optional candidate variant without replacing the protected Meshy-101 baseline.
- Local browser smoke requested and served `assets/blender/meshy-108-hifi-cshell-detail-v1.glb` with HTTP 200.

## Visual Gate

Passed as a credible high-fidelity asteroid baseline candidate.

Meshy-108 preserves the open C-shell and missing quadrant from Meshy-107 while adding visible fracture plates, raised strata, jagged rim detail, shadowed cavity, and material variation. It does not introduce buildings, machinery, facility assets, or a floor slab.

Caveat: 193 mesh objects are acceptable for proof, but this should be merged/optimized before production shipping.

## Decision

Use Meshy-108 as the current high-fidelity asteroid baseline candidate. Facility population should wait for one runtime-scale/collision acceptance pass so the baseline is framed and interaction-safe in the browser scene.
