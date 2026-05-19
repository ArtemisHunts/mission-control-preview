# Asteroid Baseline Audit Proof - 2026-05-19

## Gap Selected

Asteroid baseline audit/proof was incomplete. The repo had Meshy-19 live as the current placeholder and two high-fidelity Meshy candidates, but `mission-control-state.json` had no visual review record and no written keep/reject/next-step decision.

## Candidate Evidence

- Existing live placeholder: `assets/blender/meshy-19-clean-rock-three-openings-dark-material-pass-v2.glb`
- Local host-only cleanup candidate: `assets/blender/asteroid-core-clean-v6-host-only.glb`
- High-fidelity Meshy candidate v1: `assets/meshy/api/100-high-fidelity-asteroid-baseline-v1.meshy.glb`
- Open-front high-fidelity Meshy candidate v2: `assets/meshy/api/101-open-front-hollow-asteroid-baseline-v2.meshy.glb`
- Render proof boards:
  - `docs/visual-reviews/2026-05-18-asteroid-baseline-v1-comparison.png`
  - `docs/visual-reviews/2026-05-18-asteroid-baseline-v1-v2-comparison.png`

## Blender/GLB Metrics

- `meshy-19-current`: 1 mesh, 13,721 vertices, 19,160 triangles, 1 material, 555,248 bytes, bounds `1.902 x 1.241 x 1.245`.
- `core-clean-v6-host-only`: 1 mesh, 21,336 vertices, 42,080 triangles, 1 material, 765,744 bytes, bounds `17.946 x 9.147 x 8.68`.
- `meshy-100-hifi-v1`: 1 mesh, 311,729 vertices, 623,462 triangles, 0 imported materials, 11,223,068 bytes, bounds `1.898 x 1.862 x 1.142`.
- `meshy-101-open-front-v2`: 1 mesh, 709,987 vertices, 1,420,022 triangles, 0 imported materials, 25,560,888 bytes, bounds `1.898 x 1.859 x 1.515`.

Command used:

```bash
blender --background --factory-startup --python <temporary GLB metrics script>
```

## Verdict

`meshy-19-current` should remain only as the live placeholder. It is browser-light and already integrated, but it does not satisfy the current hero-fidelity requirement.

`core-clean-v6-host-only` is useful as a scale/layout fallback because it has production-friendly Blender source and a large host volume, but it does not beat the high-fidelity Meshy candidates on surface detail.

`meshy-100-hifi-v1` improves rock density substantially, but the v1 proof path does not clearly solve the open-front facility-host requirement.

`meshy-101-open-front-v2` is the strongest next baseline candidate because it has the highest surface density and was generated specifically for an open-front hollow asteroid shell. It is not accepted as final runtime baseline yet: it still needs a Blender production pass for materials, scale, origin/pivots, possible decimation, and an in-scene hero camera proof.

## Decision

- Mark asteroid baseline audit/proof complete.
- Promote `meshy-101-open-front-v2` to active cleanup candidate, not final accepted baseline.
- Keep facility population blocked until `task-asteroid-baseline-cleanup-export` produces an accepted Blender source and runtime GLB proof.
- Do not launch more paid Meshy generation in the next loop unless the v2 cleanup pass fails for a specific documented reason.

## Verification

- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- Blender 5.1.1 GLB import/metrics audit for all four candidates listed above.
