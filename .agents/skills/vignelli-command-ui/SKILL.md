---
name: vignelli-command-ui
description: >
  Use when a Lighthouse surface should feel like an operational command board:
  directive, route-driven, and impossible to ignore. Best for action-priority
  visual treatments, decision points, escalation surfaces, and research
  operations screens where the workflow meaning is already settled.
metadata:
  compatibility: Designed for Claude Code and OpenAI Codex. Reference attitude comes from experiments/lighthouse-style-samples/extreme-variants/sample-vignelli-command.html.
---

# Goal

Make the interface behave like a command system, not a neutral analysis board.

This is a harder variant of the Vignelli family. It keeps the same disciplined
grid logic, but increases pressure: larger type, clearer directive blocks, more
obvious route sequencing, and red surfaces that feel operational rather than decorative.

This is a visual treatment skill. It does not approve new workflow meaning,
action priority, Promise scope, Acceptance Checks, or Evidence Ledger coverage.
If the work changes what the user can do, which action matters most, or how a
contract is fulfilled, use `product-discovery-steward` or Mission Control before
using this style skill.

## Use When

- The user must decide, route, escalate, or act.
- A screen needs unmistakable next steps.
- Research operations, workflow routing, contradiction escalation, or queue control are central.

## Do Not Use When

- The task is mostly browsing or reflective reading. Fall back to the `default` skin rather than the command variant.
- The surface should feel unstable, fractured, or antagonistic. This style wants a stable command voice, not tension.
- Multiple panels need equal weight. This style wants a dominant command voice.

## Reference Sample

- `experiments/lighthouse-style-samples/extreme-variants/sample-vignelli-command.html`
- For actual Light House application, read [references/lighthouse-implementation.md](references/lighthouse-implementation.md).

Treat the sample as a pressure calibration. The actual product surface may be denser,
but the command hierarchy should remain obvious.

## Core Stance

1. Commands outrank ambience.
2. Every major section should answer: what is the next route?
3. Red can occupy larger surfaces here, but only where directive force is needed.
4. The UI should feel like signage for action, not a gallery of options.

## Visual System

### Color

- Off-white paper and black rules remain the base.
- Red gains a larger physical footprint than in a neutral Vignelli layout: slabs, route codes, command rails.
- Gray stays subordinate. It should never compete with black and red.

### Typography

- Same neutral sans family as the signal variant.
- Headlines are larger, more compressed, and more urgent.
- Labels remain uppercase and coded.
- Supporting copy stays short. The voice should be terse and operational.

### Geometry

- Use blocks and slabs rather than lightweight cards.
- Tight radii are acceptable, but geometry should still read as engineered.
- Visual weight should concentrate around the primary instruction area.

## Layout Rules

- Build around a dominant command surface plus one explicit route board.
- Left and right columns may support inputs and metrics, but the center must clearly issue direction.
- Route lists should read like operating instructions, not status summaries.
- Footer or edge labels can reinforce the idea of a system coordinate map.

## Component Patterns

- `command-hero`: oversized statement that sets the next action.
- `route-board`: stacked route entries with code, destination, and state.
- `red-slab`: urgent instruction block or active lane.
- `input-tower`: queued priorities or constraints.
- `metric-stack`: a small set of large operational counters.
- `footer-coordinates`: low-volume system context that anchors the board.

## Balance Rules

The danger here is turning the product into a poster. Keep it useful.

- One surface may shout; the rest must support it.
- Preserve scan logic even when the type gets large.
- If multiple red elements start competing, collapse them into one clear command path.
- Do not let the interface become purely rhetorical. Every strong visual move must map to a real action or state.

## Avoid

- Soft onboarding language
- Equal emphasis across all panels
- Decorative red without behavioral meaning
- Long explanation blocks under giant headlines
- Excessive component variety
- Hidden next steps

## Implementation Checklist

1. Define the primary command sentence first.
2. Assign route codes to each major branch.
3. Give one red surface ownership of urgency.
4. Collapse secondary options into quiet support panels.
5. Verify that the user can identify the next action immediately.
6. If urgency feels theatrical instead of operational, reduce headline count or red coverage.
