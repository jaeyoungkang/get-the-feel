---
name: skill-governance-steward
description: Use when creating, editing, retiring, consolidating, or reviewing Light House repo-local skills, including deciding whether repeated work should become a skill, whether an existing skill should absorb it, whether Project Knowledge is enough, periodic skill audits, trigger/frontmatter quality, generated-copy sync, and overengineering checks.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Skill Governance Steward

Use this skill for the lifecycle of repo-local skills. The goal is to keep
skills useful and scarce: enough procedure for agents to act well, not a new
skill for every recent lesson.

## Skill Decision

Classify the repeated lesson before editing files:

| Route                 | Use when                                                                |
| --------------------- | ----------------------------------------------------------------------- |
| update existing skill | a current skill already owns the workflow                               |
| new skill             | the workflow recurs, has distinct triggers, and changes agent behavior  |
| Project Knowledge     | the memory helps future work but does not define a repeatable procedure |
| docs/conventions      | the rule is broad engineering policy, not a callable workflow           |
| reject                | the lesson is one-off, too narrow, or already enforced by code/gates    |

Prefer updating an existing skill. Create a new skill only when the trigger,
workflow, and validation are clearly different from current skills.

## Candidate Signals

During implementation or review, consider a skill candidate when at least two
signals appear:

- the same agent mistake recurs across turns or PRs;
- a workflow requires a non-obvious read order;
- a task needs a reliable handoff between Codex and Claude;
- a process has specific validation commands;
- a local rule is too operational for Project Knowledge but too procedural for
  `docs/conventions.md`;
- subagent review finds missing trigger terms, drift, or over-sliced skills.

Do not create a skill only because a task was important once.

## Authoring Rules

1. Name the skill in lowercase kebab-case.
2. Keep `SKILL.md` concise. Move long background into `references/` only when it
   will be loaded conditionally.
3. Make frontmatter `description` trigger-rich. Include user phrases, file
   paths, and workflow nouns that should load the skill.
4. Put boundaries near the top: what the skill does not replace, when to route
   to Mission Control, and when to stop.
5. Include the smallest honest validation set.
6. Avoid duplicating large instructions from another skill. Link or defer
   instead.
7. If the skill creates behavior shared by Codex and Claude, edit
   `shared-skills/<name>/` only and sync generated copies.

## Review Cadence

Run a skill review when any of these happen:

- three or more repo-local skills change in one workstream;
- a new skill is added;
- subagents or reviewers report missing triggers or overengineering;
- `.claude/skills` or `.agents/skills` contains generated-copy drift;
- Project Knowledge records repeated agent mistakes for the same workflow;
- before a large agent-process PR is considered done.

For review, use at least three lenses:

1. overlap and consolidation;
2. trigger gaps and missing routes;
3. operational burden and validation drift.

Subagents are appropriate for these lenses when the user authorizes them or the
active workflow already requires role-separated review.

## Maintenance Workflow

1. Inspect current skill inventory:

```bash
find shared-skills -mindepth 1 -maxdepth 2 -name SKILL.md -print | sort
```

2. Search for stale skill names and unmanaged runtime skills:

```bash
rg -n "<old-skill-name>|<candidate-term>" AGENTS.md docs shared-skills .agents/skills .claude/skills scripts package.json -S
for d in .claude/skills/* .agents/skills/*; do if [ -d "$d" ] && [ ! -f "$d/.skill-sync-generated" ]; then echo "$d"; fi; done
```

3. Edit only `shared-skills/<name>/` for canonical skill content.
4. Update `docs/agent-skills.md` and `AGENTS.md` routing when triggers or
   taxonomy change.
5. Sync generated copies:

```bash
python3 scripts/sync-agent-skills.py --prune
```

6. Validate:

```bash
npm run format:check
npm run guard:skills
npm run pk:validate
```

If the skill affects Story Chain, Contract Maps, or quality gates, also run the
relevant steward's validation commands.

## Periodic Audit Output

Keep the audit output short:

```text
Inventory:
Consolidate:
Add/update:
Retire:
Trigger gaps:
Validation:
Next action:
```

Record durable conclusions with `npm run pk:remember`. Promote only stable,
repo-wide operating lessons to `docs/project-knowledge/shared-memory.md`.
