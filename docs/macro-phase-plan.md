# Mission Control — Autonomous Macro Phase Plan

_Last updated: 2026-04-26_

This file exists because the previous autonomous loop shipped too many tiny marker-level commits. Future autonomous work must complete phase-sized changes with mechanical gates.

## Macro gate

Before any autonomous macro pass may commit, it must run:

```bash
node scripts/macro-gate.mjs --min-source-lines=120 --max-app-lines=2600 --max-mesh-constructors=70 --max-loop-markers=75
```

The gate requires:

- at least 120 changed source lines across app/CSS/HTML files
- at least one real source file changed
- `docs/loop-metrics.json` updated
- a new/updated `docs/visual-reviews/*.md` file
- an explicit north-star verdict: `North-star verdict: closer`
- benchmark scores against the reference moodboards
- stay under app/performance budgets: app size, mesh constructor count, and procedural loop count

This is not a quality substitute. It is a floor to prevent pebble-stacking and force visual accountability. If the loop repeatedly finishes in under 15 minutes or produces barely visible deltas, raise this threshold again or split the phase into a branch-based visual review workflow.

## Visual proof gate

Every macro pass must ask:

> Are we actually closer to the final product with this update or not?

The answer must be recorded in `docs/visual-reviews/`. The review must benchmark against:

- `docs/moodboards/world-architecture.png`
- `docs/moodboards/materials-avatars.png`
- `docs/target-design-spec.md`

Required scoring categories:

- Container/shell
- Station visibility
- Lighting/readability
- Depth/scale

If the verdict is not `closer`, the pass should not commit. Keep iterating or report a real blocker.

## Cadence policy

Spacing is based on observed completion time, not vibes:

- If macro passes finish under 15 minutes, run the next pass within ~60 minutes and raise the gate.
- If macro passes take 30–75 minutes, keep a 90-minute cadence.
- If macro passes approach the timeout or hit lock contention, widen cadence to 2–4 hours.
- Do not leave multi-hour idle gaps when the last pass completed cleanly in minutes.

Current setting after observing ~7 minute v3 completion: **60-minute cadence with a 450 source-line gate**.

## Direction correction — 2026-04-26

Michael's correction after the v3 macro runs:

- The asteroid/comet should function as the **page border / proscenium**, not the dominant subject.
- The majority of the screen should be the **interior production facility**.
- The current direction drifted too far into exterior asteroid/deck-ring clutter.
- FPS started degrading, likely from too many procedural rocks, beacons, decks, and marker loops.

Corrective rule:

- Asteroid border target: roughly **15–25% of the frame**.
- Interior production facility target: roughly **75–85% of the frame**.
- Prefer fewer, larger architectural forms over many tiny rocks/markers.
- Any pass that lowers frame rate is not closer to the north star, even if it adds visual detail.
- Performance cleanup/pruning is valid macro work.

The previous line-count gate created the wrong incentive. It is now paired with ceilings for app size / mesh constructors / procedural loops.

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
