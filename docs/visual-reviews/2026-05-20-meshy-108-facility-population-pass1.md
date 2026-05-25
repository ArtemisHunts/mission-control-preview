# Meshy-108 Facility Population Pass 1

Goal 6 lane only: first facility asset population proof on the accepted Meshy-108 high-fidelity C-shell asteroid baseline.

## Gap Picked

Meshy-108 passed runtime-scale/collision acceptance. The next coherent 3D gap was proving that existing local Meshy facility assets can populate the accepted baseline without blocking the open C-shell mouth or merging facility work back into the asteroid source.

## Outputs

- Source script: `scripts/create-meshy-108-facility-population-pass1.py`
- Source baseline: `assets/blender/meshy-108-hifi-cshell-detail-v1.blend`
- Populated blend: `assets/blender/meshy-108-facility-population-pass1.blend`
- Populated runtime GLB: `assets/blender/meshy-108-facility-population-pass1.glb`
- Metrics: `docs/visual-reviews/2026-05-20-meshy-108-facility-population-pass1.json`
- Proof board: `docs/visual-reviews/2026-05-20-meshy-108-facility-population-pass1-board.png`
- Browser smoke viewer: `docs/visual-reviews/2026-05-20-meshy-108-facility-population-pass1-viewer.html`
- Browser smoke screenshot: `docs/visual-reviews/2026-05-20-meshy-108-facility-population-pass1-browser-smoke.png`
- Render set: `docs/visual-reviews/meshy-108-facility-population-pass1/`

## Selected Facility Roles

- Command: `assets/meshy/api/54-tight-panoramic-command-bunker-face.meshy.glb`
- Hangar: `assets/meshy/api/25-hangar-airlock-portal-frame-v2.meshy.glb`
- Production: `assets/meshy/api/14-fabrication-robotic-arm-background-workcell-v3.glb`
- Power: `assets/meshy/api/58-server-control-cabinet-cluster.meshy.glb`
- Logistics: `assets/meshy/api/15-docking-clamp-airlock-collar.meshy.glb`
- Catwalk: `assets/meshy/api/10-modular-catwalk-recovery-long-bridge.meshy.glb`
- Signal: `assets/meshy/api/24-communications-dish-mast.meshy.glb`
- Control: `assets/meshy/api/23-control-console-bank.meshy.glb`

## Inspection

- Source asteroid GLB: valid glTF 2.0, 193 nodes, 193 meshes, 4 materials, 0 textures, 1,690,536 bytes.
- Populated GLB: valid glTF 2.0, 241 nodes, 232 meshes, 9 materials, 0 textures, 8,671,504 bytes.
- Imported facility assets: 8 lightweight local Meshy GLBs.
- Authored support geometry: role pads, central bridge, markers, labels, and radius guide only.
- No Meshy credits spent.

## Decision

Passed first facility population proof. Visual QA accepted the revised board: the C-shell open mouth remains clear, role placement is readable in top view, and front/oblique/detail renders confirm modules on mounts. Browser smoke passed with local Chrome fetching/parsing the populated GLB and rendering the role-placement canvas proof.

Next Goal 6 3D step: run a mount-contact/intersection audit and lock the facility role inventory before expanding the populated scene.
