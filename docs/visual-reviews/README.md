# Mission Control Visual Reviews

Every phase-gated macro pass must include a visual review here.

Required fields for `scripts/macro-gate.mjs`:

```md
# Visual Review — YYYY-MM-DD short-title

Commit under review: pending
Screenshot: docs/visual-reviews/YYYY-MM-DD-short-title.png
References benchmarked: docs/moodboards/north-star-asteroid-operations-floor.png, docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png
Game Studio route: game-studio -> web-game-foundations -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest
Pass type: composition | lighting | asset-pipeline | UI | performance | playtest-fix
Skill focus: ...
Asset pipeline stance: primitive-blockout | modular-GLB-planned | GLB-integrated | not-applicable
Playtest status: screenshot-captured | screenshot-blocked | needs-human-browser-check

Pre-code Game Studio application:
- game-studio: ...
- web-game-foundations: ...
- three-webgl-game: ...
- web-3d-asset-pipeline: ...
- game-ui-frontend: applicable | not-applicable — ...
- game-playtest: ...

North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 0/5 — ...
Station visibility: 0/5 — ...
Lighting/readability: 0/5 — ...
Depth/scale: 0/5 — ...

Lighting/readability note:
- Exposure/fill/key/rim/fog changes or explicit reason no lighting change was needed.

Game Studio checklist:
- pre-code skill application followed or intentionally revised before implementation.
- three-webgl-game: camera/render/material/performance boundaries checked.
- web-3d-asset-pipeline: modularity/scale/material/GLB-readiness checked.
- game-playtest: screenshot/readability/interaction/performance checked or blocker recorded.

What moved closer:
- ...

What is still off:
- ...

Next visual fix:
- ...
```

The verdict must be honest. If the answer is not `closer`, the loop should keep working instead of committing.
