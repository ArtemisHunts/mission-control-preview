# Mission Control - Holo-Table + 3D Asset Campaign

_Created: 2026-05-18_

## Direction

Mission Control now pivots from the local operating-system foundation into two connected production lanes:

1. **Holo-table interface density** - make the command surface feel closer to the holographic reference: more information visible on one page, fewer tab hops, and task state presented as a kanban board.
2. **3D facility asset pipeline** - establish a high-fidelity asteroid baseline first, then populate it with the strongest generated Meshy facility library assets until the asteroid reads like the concept-art facility instead of a low-resolution shell with loose props.

## Holo-Table UI Goals

- Keep the holographic visual language, but reduce tab fragmentation.
- Prefer one dense operational surface with compact panels for goals, agents, telemetry, review gates, buildout, and signals.
- Convert task presentation to kanban columns: queued, active/running, blocked/review, and completed.
- Keep actions honest: local preview actions must say when they are browser-local only.
- Preserve the state-backed model; no static UI theater.

## 3D Pipeline Goals

### Step 1 - Baseline asteroid quality gate

Before adding more facility pieces, decide whether the current asteroid baseline is good enough.

Baseline must pass:

- high-resolution silhouette at hero camera distance
- dense, non-faceted rock surface with believable fractured mass
- usable hollow/cutaway volume for facility insertion
- clean enough topology/materials for Blender production edits
- runtime-export path to optimized GLB after the high-poly/source pass

The current `meshy-19` baseline is integrated, but Michael flagged it as low-resolution. Treat it as suspect until audited against newer shell candidates and/or a fresh high-fidelity generation.

### Step 2 - Meshy high-fidelity option

Meshy can be used for a higher-fidelity asteroid baseline, but the existing Meshy lane ledger says the approved Mission Control cap is already at **2100/2100 credits**. Do not launch another paid Meshy generation until there is explicit approval to raise or reopen the cap.

If approved, generate one focused asteroid parent, not a broad batch:

- target: high-poly asteroid shell / cutaway host
- style: dark carbonaceous rock, fractured, massive, hollow industrial cavern, no toy diorama scale
- output: source-quality mesh for Blender cleanup first, optimized runtime GLB second
- review: contact sheet and in-scene hero camera comparison against the current baseline

### Step 3 - Facility population

Once the baseline is strong, install existing generated assets by role instead of scattering props:

- structural shell and cutaway rim
- command/control spine and holo-table chamber
- hangar/airlock/docking hardware
- production/fabrication cells
- catwalks/bridges/service decks
- sensor/communications mast pieces
- cargo/tool/maintenance dressing

Every population pass must include visual proof and a decision: keep, demote to background, cleanup candidate, or reject.

## Reporting

- Overlay / holo-table updates stay in `#dashboard` and should use `goal-5-holo-table-density-kanban` as the active loop.
- 3D asset pipeline updates go to `<#1477048876669075578>` and should use `goal-6-high-fidelity-asteroid-baseline` as the active loop.
- Treat these as concurrent lanes. The overlay lane may use `?overlay=1&console=overview` to inspect the command surface without waiting on heavy 3D asset loading.

## Verification

- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- Holo-table screenshot after UI changes
- Blender/GLB audit for asteroid baseline candidates
- In-scene render board before accepting any high-fidelity baseline
