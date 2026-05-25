# Mission Control Lessons

_Started: 2026-05-17_

- A /goal loop is not resumed by chat intent alone. Every sub-goal needs a durable state/event artifact so restart recovery has something concrete to continue from.
- Scheduled updates for this channel must inspect only Mission Control goal artifacts. Do not pull daily heartbeat memory or unrelated project notes into /goal status reports.
- Good Mission Control goals need a contract before work starts: one objective, one stopping condition, source files to read, constraints/non-goals, verification proof, checkpoint status format, and pause/stop rules.
- Goal lanes must not cross-post. #dashboard is Goal 5 holo-table only; <#1477048876669075578> is Goal 6 3D only. Scheduler prompts need hard channel boundaries, not wording like "summarize meaningful 3D/holo-table progress here."
- For Goal 5, do not confuse state-backed UI scaffolding with reference-dashboard progress. A readable screenshot is not enough; every pass must be judged against the shared reference dashboard's layout, hierarchy, and visual language.
