# Engineering Rules

- Start lightweight. L0 asset/data/syntax checks are enough for local prototype work.
- Strengthen engineering gates only when triggers fire: code size, dependency, deployment, repeated defect, data pipeline, or promotion.
- Engineering decisions that strengthen gates reference `https://github.com/jaeyoungkang/agentic-base.git` through `skills/engineering-harness/SKILL.md`.
- Do not add lint/knip/duplication/purity tooling until the trigger is recorded.

