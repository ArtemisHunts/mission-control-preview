# Mission Control — Concept-to-3D Asset Pipeline

_Last updated: 2026-05-18_

This pipeline is for quickly turning concept art into usable in-scene assets without losing the larger art direction. It is a velocity tool, not a replacement for composition, scale, or taste.

## 1. When to use it

Use concept-to-3D for contained assets:

- operator avatars
- maintenance drones
- consoles and chairs
- cargo, crates, tools, cables
- remote bay props
- ship silhouettes and small hangar dressing
- signage, terminals, sensor dishes, fabrication rigs

Do **not** use it as the primary method for the whole asteroid facility unless the current lane is explicitly the asteroid baseline quality gate. The main environment still needs deliberate camera, blockout, massing, traversal, and depth design.

Current Mission Control priority: establish a high-fidelity asteroid baseline before adding more facility props. Michael flagged the current model as low-resolution, so the asteroid shell is now a first-class asset gate rather than background dressing.

## 2. Pipeline

1. **2D concept**
   - Generate or sketch a clear target image.
   - Prefer three-quarter views, strong silhouette, simple material zones, and no noisy background.

2. **Image to 3D mesh**
   - Candidate tools: TRELLIS/TRELLIS.2, Hunyuan3D, Tripo, Meshy, Modly, or equivalent.
   - Treat TRELLIS-style PBR output as a strong candidate for props and hard-surface dressing, pending license/runtime verification.
   - Modly watch item, 2026-05-02: `github.com/lightningpixel/modly` claims local desktop image→3D on GPU with extension support for Hunyuan3D Mini, TripoSG, and Trellis2/GGUF. Evaluate in a sandbox before trusting/installing; if it works on the local RTX 4070 Laptop GPU, use it to save Meshy credits for texturing/hard-surface finishing.
   - Goal is a rough-to-usable mesh/blockout that becomes Blender input, not blindly accepted final art.

3. **Blender production pass**
   - Blender is the default DCC for art creation, kitbashing, model cleanup, source-file edits, simple rig/animation fixes, collision proxy creation, and GLB/glTF export.
   - Keep `.blend` as the editable production source for any asset that is hand-authored or materially changed.
   - Fix scale, pivots/origins, transforms, normals, UVs, mesh names, hierarchy, and obvious topology junk.
   - Reduce material count.
   - Apply transforms.
   - Export `.glb`/`.gltf`.

4. **Rig/animate only if needed**
   - Use simple bones or Mixamo-style auto-rigging for characters.
   - Rig only moving parts: head, arms/legs, drone rotors, doors, antennae.
   - Keep idle loops subtle.

5. **Drop into Mission Control immediately**
   - Validate in the actual Three.js camera and lighting.
   - If it does not read in-scene, fix silhouette/scale/materials before adding detail.

## 3. Quality gates

Before an asset stays in the scene, it must pass these gates:

- **Silhouette:** readable at Mission Control camera distance.
- **Scale:** reinforces the massive asteroid-base read, not toy diorama scale.
- **Material clarity:** rock, graphite, steel, glass, cloth, rubber, glow, etc. are distinct.
- **Purpose:** the asset tells the user what that area does.
- **Budget:** low enough for browser delivery; no gratuitous dense meshes or many materials.
- **Integration:** matches the project palette and lighting; no pasted-in marketplace feel.
- **Source control:** edited assets retain a `.blend` production source, while runtime bundles only receive optimized GLB/glTF.

For the asteroid baseline specifically, also require:

- **Hero fidelity:** reads as dense fractured asteroid rock at the main camera distance, not a faceted placeholder.
- **Facility volume:** contains a believable cutaway/hollow interior where the facility can be embedded.
- **Production source:** high-poly/source asset stays editable in Blender; runtime GLB can be optimized later.
- **Comparison proof:** accepted only after side-by-side review against the current `meshy-19` baseline and strongest local shell candidates.
- **Spend discipline:** paid Meshy generation requires explicit approval if the current Meshy lane cap is reached.

## 4. Browser constraints

TRELLIS/TRELLIS.2-style output may include attractive PBR textures and dense detail. That is useful, but browser performance still wins. Before importing to the app, run every generated model through a web-readiness pass:

- export or convert to `.glb`/`.gltf`
- pass through Blender for source cleanup unless the asset is already verified and untouched
- inspect triangle count, material count, texture sizes, normals, UVs, pivots, and mesh hierarchy
- decimate/merge where needed
- compress with Meshopt/Draco and KTX2/Basis when useful
- verify it renders correctly under Mission Control lighting, not just in a turntable demo

Default to:

- low-poly or mid-poly geometry
- one small texture atlas or vertex colors
- 1–3 materials per asset
- baked/painted detail over geometry-heavy detail
- GLB with compressed geometry when useful
- named meshes, named animations, sane pivots

Avoid:

- hair/fur geometry
- excessive transparent materials
- huge texture stacks
- reflective shader complexity before the scene composition works
- polishing assets outside the app for hours before testing them in-engine
- treating generated hard-surface detail as mechanically meaningful without inspection

## 5. Current best first asset candidates

1. **Remote bay maintenance drone** — small, readable, animatable, reinforces facility life.
2. **Operator avatar kit** — improves agent presence without redesigning the whole scene.
3. **Console/chair kit** — upgrades primitive workstations into believable operational spaces.
4. **Cargo/tool kit** — adds scale and use to hangar/deploy areas.

Recommended first test: a remote bay maintenance drone. It is low-risk, small, and useful for proving the pipeline.

Recommended TRELLIS-style proof tests:

1. **Console/chair kit** — PBR materials matter, topology does not need to deform.
2. **Cargo/tool kit** — cheap scene richness and scale cues.
3. **Hangar/service props** — pipes, ducts, sensor boxes, repair arms, compact machinery.

Do not start with hero characters. The full asteroid shell is only first when the active goal is the baseline quality gate, as it is now.

## 6. Loop integration rule

Every autonomous art pass should decide whether it is a **facility composition pass** or an **asset pipeline pass**.

- Composition pass: camera, shell, silhouette, bay placement, depth, traversal.
- Asset pipeline pass: concept, generated rough GLB, cleanup, in-scene validation.

Do not mix both in one pass unless the edit is tiny. Composition keeps the product coherent; generated assets add speed once the frame can hold them.
