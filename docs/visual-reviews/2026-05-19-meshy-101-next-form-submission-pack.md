# Meshy-101 Next Form Submission Pack

_Captured: 2026-05-19_

## Scope

No paid Meshy generation was launched in this pass.

This was a no-spend execution-prep step for Goal 6: convert the active thin-wall hollow brief into an actual ready-to-submit Meshy spec and guarded submit script.

## What shipped

- Added guarded submit script: `scripts/submit-meshy-101-thinwall-hollow-v3.py`
- Materialized dry-run create spec: `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.create-spec.json`

## Guardrail

The script is intentionally safe by default.

Running it with no flags only writes the create spec and prints the next step. It does **not** spend credits.

Actual submission now requires an explicit opt-in:

```bash
cd ~/clawd/mission-control-preview
source ~/.config/meshy/api.env
python3 scripts/submit-meshy-101-thinwall-hollow-v3.py --submit
```

## Active prompt target

The spec locks the current desired direction into one prompt:

> High-fidelity hollow asteroid base for a sci-fi command facility, open-front cutaway shell, thin rock walls, deep irregular interior cavity, fractured geological layering, asymmetrical broken rock shelves, believable stone mass, strong macro silhouette, clear interior volume for embedded structures, rugged natural asteroid exterior, production-quality hard-surface plus geology blend, no flat slab floor, no boolean-looking cut planes, no toy-like symmetry, no buildings, no ships, no characters

## Why this matters

Before this pass, Goal 6 had a clear written brief but no ready submission pack.

Now the next paid/refine action is operationally simple:
- review the spec
- opt into submit
- poll/download the result
- judge visual viability before Blender touches anything

## Verification

- `python3 scripts/submit-meshy-101-thinwall-hollow-v3.py`
- `python3 -m py_compile scripts/submit-meshy-101-thinwall-hollow-v3.py`
- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`

## Decision

Pass.

This is real forward motion on Goal 6, but it is still prep work. No new Meshy candidate exists yet, and no credits were spent in this step.
