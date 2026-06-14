# Light House Implementation Notes

Use this reference when Light House needs a more directive, operational variant of the Vignelli family.

## Best-Fit Surfaces

- Search result action zones
- Workspace-level route orchestration
- Agent action clusters
- Alignment or operations dashboards
- Any flow where the next step must be unmistakable

This is not the browsing skin. It is the escalation and routing skin.

## Start Here

1. `app/stores/ui-skin-store.ts`
2. `app/globals.css`
3. `app/components/WorkspaceTopBar.tsx`
4. `app/components/documents/search-document-view.tsx`
5. `app/components/workspace/AgentPanel.tsx`
6. `app/components/documents/knowledge-map-document.shared.tsx`
7. `app/domain/spec-alignment.ts`

If it becomes a true skin, add a distinct enum and HTML class rather than piggybacking on `ikeda`.

## Token Strategy

Use the shared token ladder in `app/globals.css`, but increase command contrast.

Prioritize:

- `--surface-panel-strong`
- `--accent`
- `--accent-strong`
- `--accent-foreground`
- `--border-strong`
- `--chip-accent-bg`
- `--control-hover-bg`
- `--paper-panel-bg`

Recommended character:

- pale paper base
- black framing rules
- a stronger red command surface than a neutral Vignelli layout
- larger display moments
- tighter, more forceful hierarchy

## Class Hooks That Matter

- `.lh-control-accent`
- `button.lh-chip`
- `.lh-tab`
- `.lh-sidebar-item`
- `.lh-kicker`
- `.lh-panel`
- `.lh-panel-muted`

This variant should upgrade pressable surfaces first. Static display chips can remain quieter.

## Light House Mapping

### Workspace command layer

- `WorkspaceTopBar.tsx` is the natural place for route pills, current lane state, and visible operational mode.
- The top bar can carry command language, but it still needs to leave room for document context.

### Search result action layer

- In `search-document-view.tsx`, the primary CTA cluster should feel like routing decisions, not ordinary buttons.
- Promote the main action path. Compress the rest.

### Agent action layer

- `AgentPanel.tsx` is a strong fit for command treatment because the user is already choosing the next move.
- Wide, directive button surfaces are more appropriate here than decorative badges.

### Alignment and route semantics

Use `AlignmentJourneyLaneId` values as real route categories:

- `search`
- `citation_lineage`
- `gap`
- `pdf`
- `web`

This variant becomes stronger when those lanes are visible as explicit destinations rather than implicit internal types.

## Guardrails

- Do not apply command pressure to every paper card.
- Keep long-form evidence reading surfaces quieter than route and action surfaces.
- One dominant command zone per screen is enough.
- If red starts appearing in multiple unrelated actions, collapse back to a single operational lane.
