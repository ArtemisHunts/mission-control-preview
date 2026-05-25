# Meshy-108 Runtime Scale Collision Acceptance

Goal 6 lane only: prove the accepted Meshy-108 high-fidelity asteroid baseline is framed at runtime scale and has a coarse browser collision/selection proxy before facility population begins.

## Gap Picked

Meshy-108 passed the high-fidelity visual baseline-candidate gate, but facility population was still blocked on runtime-scale/collision acceptance.

## Outputs

- Source script: `scripts/create-meshy-108-runtime-scale-collision-proof-v1.py`
- Proof blend: `assets/blender/meshy-108-runtime-scale-collision-proof-v1.blend`
- Collision proxy GLB: `assets/blender/meshy-108-collision-proxy-v1.glb`
- Metrics: `docs/visual-reviews/2026-05-20-meshy-108-runtime-scale-collision-proof-v1.json`
- Proof board: `docs/visual-reviews/2026-05-20-meshy-108-runtime-scale-collision-board.png`
- Browser smoke: `docs/visual-reviews/2026-05-20-meshy-108-runtime-scale-collision-browser-smoke.png`
- Render set: `docs/visual-reviews/meshy-108-runtime-scale-collision-proof-v1/`

## Inspection

- Visual GLB: valid glTF 2.0, 193 nodes, 193 meshes, 4 materials, 0 textures, 1,690,536 bytes.
- Collision proxy GLB: valid glTF 2.0, 16 nodes, 16 meshes, 1 material, 0 textures, 25,712 bytes.
- Runtime variant: `?camera=detail&asteroid=108`
- Runtime scale: `5.8`
- Runtime scaled dimensions: `36.6535 x 35.3255 x 11.957`
- Runtime placement: position `[0.0, -4.8, -11.7]`, rotationY `0.54`

## Collision Decision

The proxy uses 16 coarse static boxes: 14 arc segments around the C-shell mass and 2 torn-end blockers. Visual QA passed the setup because the cyan proxy broadly covers the Meshy-108 shell while leaving the open mouth/missing quadrant unblocked.

This proxy is accepted for coarse static collision/selection only. It is not a fine-grain physical-contact mesh.

## Result

Passed runtime-scale/collision acceptance. Facility asset population can begin on Meshy-108 as the accepted baseline, with the facility pass kept separate from the asteroid baseline source.
