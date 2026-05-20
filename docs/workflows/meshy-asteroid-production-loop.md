# Meshy Asteroid Production Loop

This workflow is the required gate for Mission Control asteroid-shape iteration after the failed Meshy-101 hollow v2 public preview.

## Skill Stack

- Use `meshy-3d-agent` and `meshy-3d-generation` for Meshy prompt planning, API task structure, polling, download organization, and cost discipline.
- Use Blender only after a Meshy candidate already has the right form read. Blender is for normalization, scale, pivots, material cleanup, decimation, GLB export, and proof renders.
- Use the existing web 3D pipeline for runtime validation, browser screenshots, and Pages deployment checks.

## Hard Rules

1. Keep `meshy-101-open-front-clean-runtime-v1.glb` as the protected public baseline until a better candidate passes review.
2. Do not publish a new asteroid candidate live until it has passed local visual proof first.
3. Do not spend Meshy credits without an explicit cost summary and confirmation in chat.
4. Save generated Meshy files under `meshy_output/` in the current project, grouped by task folder, with metadata preserved.
5. Download Meshy outputs immediately; non-enterprise generated asset URLs may expire.
6. Do not hand-sculpt major asteroid form changes in Blender unless the edit is small and mechanically safe.

## Candidate Prompt Target

The next candidate should be generated or refined toward:

- high-fidelity natural asteroid shell
- open-front cutaway
- visibly thinner rock walls than Meshy-101 clean v1
- larger usable interior volume for facility props
- uneven eroded rim, not a smooth bowl
- natural cavern floor and wall breakup
- no flat platform floor unless deliberately architectural
- no eggshell-thin silhouette
- no blocky boolean-cut interior
- no toy/diorama scale cues

## Pre-Spend Checklist

Before any Meshy generation task:

1. Run Meshy readiness detection from the project root.
2. Check current credit balance if an API key is available.
3. Present the prompt, API path, expected stages, and credit cost.
4. Wait for confirmation before creating the task.

Preferred first experiment:

- Text-to-3D preview only for form exploration.
- Use `ai_model: latest`, `model_type: standard`, `topology: triangle`, and a high target polycount only if needed for the asteroid surface read.
- Refine/texturing happens only after the mesh silhouette and interior volume pass review.

## Acceptance Gate

A candidate can replace the public baseline only after:

1. Meshy preview/render looks better than the protected baseline.
2. Blender import succeeds without destructive repair.
3. GLB export validates with no blocking glTF errors.
4. Browser scene loads the GLB from the local preview.
5. Desktop screenshot proves the asteroid reads as a high-quality hollow facility shell.
6. Michael accepts the visual direction or explicitly asks to publish it for inspection.

## Failure Handling

If a candidate fails visual review:

- Keep it documented as a failed candidate.
- Do not keep polishing it just because credits were spent.
- Extract the failure reason into the next prompt.
- Leave the public preview on the protected baseline.
