# Mission Control — Concept-to-3D Asset Pipeline

_Last updated: 2026-04-26_

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

Do **not** use it as the primary method for the whole asteroid facility. The main environment still needs deliberate camera, blockout, massing, traversal, and depth design.

## 2. Pipeline

1. **2D concept**
   - Generate or sketch a clear target image.
   - Prefer three-quarter views, strong silhouette, simple material zones, and no noisy background.

2. **Image to 3D mesh**
   - Candidate tools: Hunyuan3D, Tripo, Meshy, or equivalent.
   - Goal is a rough GLB/blockout, not final art.

3. **Cleanup**
   - Use Blender/Meshy/Tripo cleanup to fix scale, pivots, normals, mesh names, and obvious topology junk.
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

## 4. Browser constraints

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

## 5. Current best first asset candidates

1. **Remote bay maintenance drone** — small, readable, animatable, reinforces facility life.
2. **Operator avatar kit** — improves agent presence without redesigning the whole scene.
3. **Console/chair kit** — upgrades primitive workstations into believable operational spaces.
4. **Cargo/tool kit** — adds scale and use to hangar/deploy areas.

Recommended first test: a remote bay maintenance drone. It is low-risk, small, and useful for proving the pipeline.

## 6. Loop integration rule

Every autonomous art pass should decide whether it is a **facility composition pass** or an **asset pipeline pass**.

- Composition pass: camera, shell, silhouette, bay placement, depth, traversal.
- Asset pipeline pass: concept, generated rough GLB, cleanup, in-scene validation.

Do not mix both in one pass unless the edit is tiny. Composition keeps the product coherent; generated assets add speed once the frame can hold them.
