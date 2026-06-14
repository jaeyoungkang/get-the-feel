---
name: mission-control-sufficiency-review-live-judge-stamp
description: Stamp format for Evidence Ledger review entries that claim a qualitative Intent Check verdict.
---

# Sufficiency Review Live Judge Stamp

Use this stamp when a Evidence Ledger review entry claims `Verdict: met` for one or
more Intent Checks that require live judge evidence.

```markdown
- Judge evidence: `npx vitest run <path> -t "<test name>"`
- Runtime surface: actual `respond` tool-call output or rendered DOM
- Result: `met`
- Stability: <single run | N repeated runs>
```

Deterministic Acceptance Check-only ledgers do not need this stamp. They must
instead cite the concrete `run:shell` or guard that proves each Acceptance
Check.
