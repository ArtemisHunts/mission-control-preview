# Meshy-101 Next Meshy Form Brief

_Prepared: 2026-05-19_

## Scope

This is the active Goal 6 execution brief.

Do **not** start in Blender. The next step is a Meshy-first form iteration for a better thin-wall hollow asteroid shell. Blender only comes back in after a visually viable Meshy result exists.

## Why this pass exists

The current clean Meshy-101 rollback is a safe runtime placeholder, but the rejected hollow v2 form proved the real gap is form language, not cleanup discipline.

We need one stronger Meshy candidate that keeps the open-front cutaway idea while dropping the slabby boolean-floor look.

## Exact target

Generate or refine a candidate with all of these traits:

1. **Thin-wall asteroid shell** — rock mass should read carved and structural, not like a thick cut block.
2. **Open-front hollow** — the front opening should expose meaningful interior volume, not a shallow scoop.
3. **Irregular interior geology** — cavity walls/floor should feel fractured, layered, and asymmetrical.
4. **Usable facility void** — enough interior clearance to support later facility population without the cavity collapsing into noise.
5. **Readable silhouette** — from medium distance it should still read as one coherent asteroid shell with a deliberate cutaway.

## Avoid

- Flat interior floors
- Long straight wall planes
- Black/gray boolean scars
- Perfectly circular cavity reads
- Exterior silhouette drift that loses the open-front identity
- Overly noisy micro-detail that kills the macro cavity read

## Prompt spine

Use this as the base direction, then adapt to the actual Meshy prompt/refine interface:

> High-fidelity hollow asteroid base for a sci-fi command facility, open-front cutaway shell, thin rock walls, deep irregular interior cavity, fractured geological layering, asymmetrical broken rock shelves, believable stone mass, strong macro silhouette, clear interior volume for embedded structures, rugged natural asteroid exterior, production-quality hard-surface + geology blend, no flat slab floor, no boolean-looking cut planes, no toy-like symmetry

## Refine notes

If refining from the current Meshy-101 family, bias toward:

- thinner shell thickness
- more believable cavity depth
- fewer planar floor/wall reads
- more layered rock breakup around the opening rim
- stronger underside and sidewall variation
- cleaner macro cavity shape before chasing extra detail

## Acceptance gate before Blender

Only move a candidate into Blender if it passes this visual bar first:

- front opening still reads immediately
- cavity feels deep, not scooped
- shell walls look materially thinner
- interior planes are no longer the first thing you notice
- no obvious new silhouette regression versus the current clean rollback baseline

If the candidate fails any of those, keep the verdict honest and stop there.

## Ready-to-run submission path

The brief now has a concrete no-spend launch path attached to it:

- Guarded submit script: `scripts/submit-meshy-101-thinwall-hollow-v3.py`
- Current create spec: `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.create-spec.json`

Current retry pack after Meshy-102/103 rejection:

- Guarded submit script: `scripts/submit-meshy-104-asymmetric-cshell-v1.py`
- Current create spec: `assets/meshy/api/104-asymmetric-broken-c-shell-asteroid-v1.create-spec.json`
- Proof note: `docs/visual-reviews/2026-05-20-meshy-104-asymmetric-cshell-submission-pack.md`
- Target: break Meshy-103's tube/ring symmetry by asking for an asymmetrical broken C-shaped shell with a large missing quadrant, while preserving the no-floor/no-slab constraint.

Dry-run only:

```bash
cd ~/clawd/mission-control-preview
python3 scripts/submit-meshy-101-thinwall-hollow-v3.py
```

Actual Meshy submission remains explicit:

```bash
cd ~/clawd/mission-control-preview
source ~/.config/meshy/api.env
python3 scripts/submit-meshy-101-thinwall-hollow-v3.py --submit
```

## Output handoff once a candidate passes

After visual acceptance, then:

1. export/save the Meshy candidate as the next source artifact
2. normalize/cleanup in Blender
3. export optimized runtime GLB
4. rerun Mission Control browser proof at `http://127.0.0.1:4177/?camera=detail`

## Suggested artifact naming

- Proof note: `docs/visual-reviews/2026-05-19-meshy-101-next-form-brief.md`
- Accepted Meshy source: `assets/meshy/api/meshy-101-thinwall-hollow-v3.*`
- Blender cleanup source: `assets/blender/meshy-101-thinwall-hollow-v3.blend`
- Runtime GLB: `assets/blender/meshy-101-thinwall-hollow-runtime-v3.glb`

## Decision rule

This brief is complete when it makes the next Meshy pass unambiguous.

It does **not** mean a new asteroid candidate exists yet.
