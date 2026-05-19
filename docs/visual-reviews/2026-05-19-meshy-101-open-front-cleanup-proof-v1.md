# Meshy 101 Open-Front Cleanup Proof - 2026-05-19

## Input

- Source GLB: assets/meshy/api/101-open-front-hollow-asteroid-baseline-v2.meshy.glb
- Source size: 25,560,888 bytes
- Raw imported mesh: 709,987 vertices / 1,420,022 triangles / bounds [1.8981, 1.8586, 1.5149]

## Cleanup Pass

- Blender source saved: assets/blender/meshy-101-open-front-cleanup-proof-v1.blend
- Runtime GLB exported: assets/blender/meshy-101-open-front-clean-runtime-v1.glb
- Runtime size: 6,562,104 bytes
- Runtime mesh: 136,620 vertices / 273,500 triangles / bounds [17.0019, 16.6467, 13.5671]
- Decimation ratio: 0.22
- Triangle reduction: 80.7%
- Size reduction before glTF-Transform optimization: 74.3%

## Proof Render

- Render: docs/visual-reviews/2026-05-19-meshy-101-open-front-cleanup-proof-v1.png
- The render includes simple deck/holo-table scale proxies so the open-front cavity can be judged as a facility host, not just a standalone rock.
- The runtime export selects only the cleaned asteroid mesh and material, not the proof helper blocks.

## glTF Runtime Inspection

- `npx --yes @gltf-transform/cli inspect assets/blender/meshy-101-open-front-clean-runtime-v1.glb` loaded the runtime GLB successfully.
- Runtime structure: glTF 2.0, one scene, one mesh, one primitive, one opaque material, no textures, no animations, no required extensions.
- Runtime budget: 136,620 uploaded vertices, 273,500 triangles, 6.56 MB mesh size.

## Verdict

meshy-101-open-front-v2 passed the cleanup/export gate as a Blender-editable source and normalized runtime GLB candidate. It is usable for the next browser/in-scene proof, but is not yet the final accepted baseline. Facility population stays blocked until browser load verification and final visual acceptance pass.

## Verification

- Blender 5.1.1 imported the raw Meshy GLB.
- Blender cleanup generated the source .blend, runtime .glb, PNG proof render, and metrics JSON.
- `jq` validates the metrics JSON.
- `npx --yes @gltf-transform/cli inspect` validates the runtime GLB structure.
- Follow-up gate still required: Mission Control browser/in-scene runtime load proof.
