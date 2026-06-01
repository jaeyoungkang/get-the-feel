# Engineering Rules

- Keep the macro map as the primary UI surface. Detail panels support the map; they do not replace it.
- Every displayed score or state must have a data contract object before representative promotion.
- Do not render `observed` when `calculation_status` is `example` or `unknown`.
- Prefer small static modules and explicit data structures until the source/update pipeline is real.
- Add mechanical checks for rules that have already failed once.
- Engineering decisions must reference `https://github.com/jaeyoungkang/agentic-base.git` through `skills/engineering-harness/SKILL.md`.
- Quality gates strengthen by maturity level: L0 asset/syntax, L1 lint/format/dependency, L2 knip/dead-code/duplication/purity, L3 tests/coverage/build/CI.
- Do not promote to representative, beta, or sellable if the required quality level commands are missing.
