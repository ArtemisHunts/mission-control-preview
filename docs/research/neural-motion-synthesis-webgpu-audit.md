# Neural Motion Synthesis / WebGPU Candidate Audit

_Date: 2026-04-26_

Candidate source:

- Tweet: https://x.com/sweriko/status/2048463808272732513
- Demo: http://motionsynth.sweriko.com
- Source: https://github.com/sweriko/ai4anim-webgpu
- Repo commit reviewed: `b539455f849f284a1e814eb11ab649eb594319dc`

## What it is

A TypeScript / Three.js / WebGPU port of AI4AnimationPy-style neural motion matching for biped and quadruped characters. It runs pre-baked neural bundles in-browser and drives shared instanced skinned meshes.

Potential Mission Control relevance:

- believable operator idle/walk motion
- autonomous background NPC movement
- service dog / quadruped / drone analog behavior inspiration
- shared instanced skinned mesh architecture for many lightweight agents
- browser-side WebGPU inference pattern, if we later need richer live character motion

## Initial static safety read

Static review performed without running the app or installing dependencies.

Observed package scripts:

- `dev`: `vite`
- `build`: `tsc --noEmit && vite build`
- `preview`: `vite preview`
- `typecheck`: `tsc --noEmit`

Dependencies are limited and unsurprising:

- `three`
- `stats-gl`
- `tweakpane`
- dev: TypeScript, Vite, Three types, Tweakpane core

Red-flag grep found no obvious:

- `eval()` / `new Function`
- `child_process`
- shell execution
- cookie access
- local/session storage access
- websocket / beacon exfiltration
- remote runtime imports
- lifecycle install scripts in `package-lock.json`

Network fetches observed in source are for local model bundles:

- `${base}${kind}.json`
- `${base}${kind}.bin`

## Important blockers / risks

### License blocker

The repo license is **CC BY-NC 4.0** / non-commercial, derived from Meta/AI4AnimationPy work.

That means: **do not copy, ship, or embed this code/models into a commercial/public product path without explicit permission or legal review.**

Safe near-term use:

- study the architecture
- prototype privately
- use as inspiration
- build our own lightweight approximation

Unsafe without clearance:

- copying code into Mission Control
- shipping their neural weights/assets
- using derivative behavior in a commercial release without confirming license rights

### Technical risk

- WebGPU availability varies by browser/device.
- Bundles are large: roughly 18MB each for biped/quadruped `.bin` files.
- This is advanced machinery for our current stage; the environment shell/composition still matters more.
- If integrated directly, it could add complexity before the visual container is solved.

## Recommendation

Do **not** import this code now.

Recommended path:

1. Keep current priority on outside-in Mission Control scene composition.
2. Later, create an isolated `motion-lab` branch/prototype.
3. Audit dependencies with lockfile + `npm audit` in sandbox before running.
4. Run locally with network disabled except local dev server.
5. Extract concepts, not code:
   - shared instanced animated operators
   - simple autopilot steering
   - procedural idle/walk loops
   - maybe WebGPU inference only if we truly need it
6. For production, either build our own clean-room lightweight motion system or obtain explicit permission for commercial use.

Bottom line: technically interesting, static scan looks relatively clean, but license makes direct implementation a no-go for now.
