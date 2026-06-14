---
name: branch-review-response
description: Use when responding to PR or branch review feedback, including CodeRabbit, GitHub review threads, Copilot comments, CI/preview review notes, or human reviewer comments. Guides agents through verifying findings, applying minimal fixes, validating, pushing, and replying/resolving review threads.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Branch Review Response Skill

Use this skill when a user asks to handle review feedback on a branch or PR:
CodeRabbit, GitHub review threads, Copilot/code scanning comments, Vercel preview
review notes, or human reviewer comments. The goal is not only to patch code; the
agent must close the review loop by commenting or resolving threads when possible.

## Review Loop

This workflow is iterative. One pass is not enough unless there are no new
findings after push, remote CI, bot review, thread replies, merge, and issue
reconciliation. Whenever a pushed fix creates new review comments, failed
checks, CodeRabbit/Copilot findings, or issue follow-up, return to step 1 with
the new evidence. Report a loop as complete only when the current PR head has no
unresolved actionable review findings, relevant remote checks are complete, and
related issues have been reconciled.

1. Identify the target branch/PR.
   - Prefer the explicit PR URL/number from the user.
   - If missing, inspect the current branch and associated PR.
   - Collect PR metadata, changed files, review threads, review comments, and
     conversation comments with GitHub tools or `gh`.
2. Extract actionable findings.
   - Separate actionable review findings from praise, release notes, summaries,
     bot metadata, deployment notices, and already-resolved discussion.
   - Include CodeRabbit findings as normal review findings; do not special-case
     them beyond parsing their generated comment format.
3. Verify each finding against current code.
   - Treat review comments as hypotheses, not truth.
   - Read the relevant current files and PR diff before editing.
   - Classify each finding as `valid`, `invalid`, `already-fixed`,
     `duplicate`, or `needs-human-decision`.
4. Fix only still-valid issues.
   - Keep changes minimal and aligned with local conventions.
   - Do not broaden scope to unrelated refactors.
   - If Story Chain, runtime-flow, Promise, Aspect, Acceptance Check, or Evidence
     Ledger content changes, use the relevant Mission Control skill and gates.
5. Validate before responding.
   - Run the smallest honest targeted tests for the changed surface.
   - Run repo gates appropriate to the change. For code changes, prefer at least
     targeted test, `npm run format:check`, `npm run lint`, and
     `npm run typecheck`. For Story Chain docs, include
     `npm run mc:validate-story-chain` and `npm run evidence-ledger:dry`.
     When a Promise, AC, Evidence Ledger, or user-facing contract changes, also
     run the impacted ledger evidence for real with
     `npm run evidence-ledger -- --ledger <ledger>`.
6. Commit and push when the user asked for a complete review response flow or
   when the branch/PR response requires remote reviewers to see the fix.
   - Let existing git hooks run; do not bypass them.
   - Record the pushed commit SHA for review replies.
7. Monitor remote CI until completion. Local gates passing is not the same as
   GitHub Actions / required status checks passing — the PR is not actually
   ready until the remote checks finish.
   - After pushing, list the PR's status checks with
     `gh pr view <pr> --repo <repo> --json statusCheckRollup` and identify
     in-flight checks (status `IN_PROGRESS` / `QUEUED`).
   - Poll until every relevant check reaches `status = COMPLETED`. A simple
     `bash` polling loop with `gh pr view ... --jq` every 30s is enough; run
     it in the background and wait for the notification so the conversation
     stays responsive. Do not declare the review-response workflow closed
     while a required check is still running.
   - If a check finishes with `conclusion = FAILURE`, treat the failure as a
     new finding: read the failing job log
     (`gh run view <run-id> --repo <repo> --log-failed`), classify the cause
     against the just-pushed change, fix or roll back, and loop back to
     step 5. Do not move to step 8 with a red CI on the head commit.
   - If a check is unrelated to the change (e.g., a flaky job the team
     already acknowledged), say so explicitly in the final reply and link
     the prior decision; do not silently ignore red checks.
8. Reply and resolve review threads.
   - For fixed valid findings, reply with a short note: what changed, commit
     SHA if pushed, and key validation.
   - For invalid or already-fixed findings, reply with the concrete reason and
     file/line evidence.
   - Resolve the GitHub review thread when the finding is fixed or conclusively
     answered. If the available tools cannot resolve the thread, leave the reply
     and state the blocker in the final answer.
   - Do not resolve threads needing a human product/API/policy decision.
9. Add a concise PR conversation summary when multiple findings were handled.
   Include:
   - fixed findings
   - skipped/invalid findings with reasons
   - validation run
   - pushed commit SHA, if any
10. Reconcile related issues before declaring the PR workflow done.
    - Inspect linked/closing issues, issue references in PR body/comments, and
      upstream/downstream follow-up issues mentioned during the work.
    - Close only issues whose acceptance is fully handled by the merged PR.
    - If an issue is only partially handled, leave it open and comment with:
      what the PR completed, what remains, and any linked follow-up/upstream
      tracker.
    - If the PR creates a new follow-up obligation, ensure an issue exists or
      add the follow-up to the appropriate existing issue before final reply.
    - Mention issue outcomes in the final response: closed, kept open with
      reason, or moved upstream.
11. Decide whether another loop is required.
    - Loop again when new commits, review comments, CI failures, bot summaries,
      unresolved review threads, or issue follow-ups appear after the previous
      pass.
    - Stop only when no actionable findings remain for the current PR head.
    - If follow-up issues remain open by design, report the review-response loop
      as closed for this PR but not the product work as fully complete.

## Response Policy

- Findings lead the work. Summaries come after the review issues are classified.
- Treat the numbered workflow as a loop, not a one-shot checklist.
- Do not ask the user whether to resolve/comment after a successful fix; do it
  as part of the review response flow unless the user asked for local-only work.
- Keep public replies factual and compact. Avoid defensive language.
- Do not claim a thread was resolved unless the GitHub thread was actually
  resolved through tooling.
- Do not declare the review-response workflow closed while a required remote
  CI check is still `IN_PROGRESS` / `QUEUED` on the pushed head commit.
  Local gates green is necessary but not sufficient; the user's reviewers
  judge by the GitHub status checks. Poll to completion (step 7) and report
  the final conclusion.
- If a bot posted one large aggregate comment with no inline thread, add a
  top-level PR comment summarizing the response instead of trying to resolve a
  nonexistent thread.
- Do not say a merged PR is fully handled until related issues are reconciled.
  A clean merge with green checks is not enough when product or provider
  follow-up issues remain open.

## Minimal Reply Templates

Fixed:

```md
Fixed in `<sha>`. The failure path now [specific change]. Validation: `<command>`.
```

Invalid:

```md
I checked current `<file>` and this no longer applies: [specific reason]. No code change.
```

Needs human decision:

```md
Leaving this unresolved because it changes [contract/API/product behavior]. Needs human decision before implementation.
```
