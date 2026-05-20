# Goal 5 - Holo-Table Reference Match Contract

_Approved: 2026-05-19_

## Objective

Move Mission Control's command overlay from a functional dashboard into a product surface that matches the previously shared concept-art direction: a central holographic command table that anchors the layout, with operational state projected around it as one dense command surface.

## Target Read

- The command table is the hero object, not a generic panel grid.
- Information appears to radiate from or attach to the table: mission state, execution queue, agents, reviews, telemetry, artifacts, and events.
- The overview is the primary product surface. Tabs become drill-downs, not the only way to understand the system.
- The look is cinematic and holographic, but operational data stays readable.
- No fake automation or decorative data. All displayed state comes from canonical Mission Control state or clearly labeled local preview state.

## Layout Contract

- **Center:** active goal, current run, and command-table state.
- **Left band:** execution queue / task flow.
- **Right band:** agents, assignment pressure, and review pressure.
- **Top band:** goal lanes, health, and system summary.
- **Bottom band:** latest events, artifacts, telemetry, and evidence.

## Work Passes

1. **Reference lock:** record the concept-art matching criteria in state and tasks.
2. **Composition pass:** rebuild the overview around a table-driven layout instead of loose dashboard cards.
3. **Visual language pass:** add layered holographic glass, table glow, thin strokes, compact labels, and depth.
4. **Interaction pass:** keep drill-down tabs/drawers available, but make the default overview sufficient for first inspection.
5. **Acceptance pass:** capture desktop and mobile screenshots and compare against the reference criteria.

## Acceptance Criteria

- Screenshot comparison shows the same composition intent as the concept art.
- The command table dominates the layout.
- Core ops state is visible without hunting through tabs.
- Task flow remains kanban-backed and state-backed.
- Review, asset, telemetry, and event state remain truthful.
- Desktop and mobile overlays remain readable and non-overlapping.

