# Mission Control — Autonomous Macro Phase Plan

_Last updated: 2026-04-26_

This file exists because the previous autonomous loop shipped too many tiny marker-level commits. Future autonomous work must complete phase-sized changes with mechanical gates.

## Macro gate

Before any autonomous macro pass may commit, it must run:

```bash
node scripts/macro-gate.mjs --min-source-lines=220
```

The gate requires:

- at least 220 changed source lines across app/CSS/HTML files
- at least one real source file changed
- `docs/loop-metrics.json` updated

This is not a quality substitute. It is a floor to prevent pebble-stacking.

## Current phase: outside-in scene recomposition

Michael's directive:

- The user must not feel trapped inside the room.
- The opening read should be: looking into a vertical slice of a large asteroid production base.
- All four station districts should be visible in the default overview.
- Lighting must be readable, not black-crushed and not flat neon wash.
- Do not continue interior prop/detail work until this phase reads.

Acceptance checklist:

- [ ] Default view clearly frames the full asteroid cutaway container.
- [ ] All four station districts are visible without navigating.
- [ ] The asteroid border/crown/sill reads as a thick carved shell, not decorative rocks.
- [ ] Rear depth suggests the production base continues beyond the visible slice.
- [ ] Lighting has readable silhouettes: top fill, rim, practicals, and table glow are balanced.
- [ ] The pass creates a screenshot-level difference from the previous commit.

Allowed work bundles:

1. Camera/framing + layout rescale.
2. Container mass/cut-plane rewrite.
3. Lighting/fog rebuild.
4. Facility depth/negative-space expansion.

A pass may touch multiple bundles if they serve one macro thesis.

## Next phases

1. **Facility shell architecture** — structural ribs, decks, service tunnels, hangar layers, rail systems.
2. **Station district clarity** — make each bay readable at the wide camera distance.
3. **Hero command table** — make the center iconic once the container reads.
4. **Asset pipeline pass** — generated/GLB props only after the frame is structurally convincing.
