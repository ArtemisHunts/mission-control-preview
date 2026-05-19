# Meshy 101 Open-Front Hollow V2 - 2026-05-19

## Direction

Michael liked the Meshy-101 surface read but asked for more usable interior space and thinner walls overall. This pass keeps the v1 candidate intact and creates a separate carved v2 artifact.

## Output

- Blender source: assets/blender/meshy-101-open-front-hollow-v2.blend
- Runtime GLB: assets/blender/meshy-101-open-front-hollow-runtime-v2.glb
- Optimized runtime GLB: assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb
- Proof render: docs/visual-reviews/2026-05-19-meshy-101-open-front-hollow-v2.png
- Browser proof: docs/visual-reviews/2026-05-19-meshy-101-hollow-v2-browser-proof.png
- Metrics JSON: docs/visual-reviews/2026-05-19-meshy-101-open-front-hollow-v2.json

## Metrics

- Source: 709,987 vertices / 1,420,022 triangles / 25,560,888 bytes
- V2 runtime: 82,161 vertices / 164,347 triangles / 4,639,712 bytes
- Runtime bounds: [17.0019, 16.6472, 13.5671]
- Triangle reduction vs source: 88.4%
- Size reduction vs source: 81.8%

## Carve Notes

- Expanded the open-front interior volume with broad rounded boolean cuts.
- Added floor, ceiling, and side-wall clearance cuts to create more prop-usable volume.
- Kept a visible rim and rear mass so the asteroid still reads as a shell, not just loose scenery.

## Verification

- Blender 5.1.1 generated the carved source, runtime GLB, proof render, and metrics JSON.
- glTF Transform optimized the runtime GLB from 4.64 MB to 3.95 MB.
- glTF Transform validation passed on the optimized runtime GLB with no errors, warnings, infos, or hints.
- Local Chrome headless smoke loaded the Mission Control page and requested the optimized v2 GLB successfully from the local preview server.

## Status

V2 is the new visual candidate for thinner walls and larger interior space. It is wired as the active local preview asset, but still needs human visual acceptance before it becomes the final accepted baseline.
