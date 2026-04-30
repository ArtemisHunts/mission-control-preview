# Visual Review — 2026-04-29 Concept C HIFI-24 single-mesh pipeline pivot

Commit under review: pending
Branch: `concept-c-hifi`
Screenshot: `docs/visual-reviews/2026-04-29-concept-c-hifi-24-local.png`
Side-by-side: `docs/visual-reviews/2026-04-29-concept-c-hifi-24-side-by-side.png`
Reference: corrected `docs/reference/concept-c-asteroid-cavern-target.png`

## Trigger
Michael called out that the scene had returned to blockout shapes and asked why we cannot make a high-fidelity spherical object. Correct answer: the visible construction method was wrong. The panel/shard stack can iterate fast but keeps reading as assembled blockout geometry.

## Pipeline check
- Blender/headless GLB export is **not available** in this workspace (`which blender` returned nothing).
- HIFI-24 therefore implements the browser-native fallback: one high-density displaced ellipsoid/spherical `BufferGeometry` asteroid shell with a carved concave bowl aperture.
- This is a stand-in for the desired future Blender/Geometry Nodes/GLB pipeline.

## Thesis
Stop building the visible asteroid out of layered panels. Hide the panel stack and render one continuous displaced asteroid mesh with an actual carved aperture and concave bowl interior.

## What changed
- Added `buildHifi24SingleMeshAsteroidPipelinePass()`.
- Runtime-hid old HIFI-07 through HIFI-23 panel/facility/detail stacks.
- Generated one high-density displaced ellipsoid asteroid shell mesh.
- Cut an irregular front bowl aperture by omitting shell triangles inside the mouth.
- Generated a concave carved bowl interior surface as geometry, not a pasted mask.
- Added a continuous rim/roof-overhang mesh between shell and bowl.
- Updated readout/cache-bust to HIFI-24.

## Smoke checks
- `node --check --input-type=module < app.js` ✅
- `git diff --check` ✅
- Local server + OpenClaw CDP screenshot capture ✅

## Visual gate scores
Pipeline direction: 4.1/5 — correct pivot away from panels.
Single-object cohesion: 3.8/5 — much better; reads as one object instead of stacked slabs.
Spherical/ellipsoid asteroid read: 3.1/5 — partial; still too flat/donut-like from camera.
Carved opening / bowl read: 3.6/5 — aperture is clear, but too circular/mathematical.
Rock/geology fidelity: 2.9/5 — higher density, but displacement is still too uniform/procedural/spiky.
Reference match: 3.2/5 — better construction method, not final target.
Performance/readiness: 3.4/5 — browser capture works with the mesh.

Overall visual gate: 3.4/5 / C+ to B- directionally

## Honest read
This is the right pipeline direction and clearly better than continuing panel/blockout passes. It creates one continuous asteroid object with a carved bowl, which is what we needed to prove.

But it is not final quality. Current failure modes:
- asteroid reads too flat / donut-like instead of full ellipsoid mass
- rim/cavity is too circular and mathematically clean
- displacement is too uniform/spiky rather than art-directed geology
- interior bowl has radial/polar generation artifacts
- material still reads procedural clay/mesh, not rock with AO/strata/mineral variation

## Next technical fix
Stay on the single-mesh pipeline. Do **not** return to panels.

HIFI-25 should improve the generated asset itself:
- stronger global ellipsoid volume / less puck silhouette
- irregular non-circular aperture mask
- macro deformation before micro displacement
- separate exterior/rim/interior displacement styles
- reduce uniform spikes and radial bowl artifacts
- add region-based material/color masks for crust, rim, deep bowl, dust, crevice shadow

## Tool need
Best next tool remains Blender/Geometry Nodes/GLB export. Browser-native single mesh is better than panels, but Blender would allow booleans, remeshing, sculpt/displacement, and baked normals/AO without fighting Three.js procedural topology.
