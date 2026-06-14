---
name: decision-log-draft
description: Use on every contract-affecting PR when it is opened, synchronized, pushed, merged, or when the user asks for `/admin-log` or `/decision-log`. Drafts a /admin/decision-log entry and related i18n or /about/changes skeletons by reading PR metadata and contract-path diffs, then prepares the follow-up review surface for human approval.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Decision Log Draft Skill

Use this skill **on every contract-affecting PR**, ideally on PR open or sync.
`/admin/decision-log` is the source of truth for contract-affecting decisions;
`/about/changes` is a user-facing subset of that same data. The script writes
both in one pass — the admin entry always, the public entry only when the PR's
changes are user-facing.

## When to invoke

Single trigger: a contract-affecting PR. Self-trigger on any of these signals:

- The user says a PR was opened, updated, or merged (e.g., "PR 올렸다",
  "머지했다", "merged", "shipped #N", "let's log this PR").
- You just called `gh pr create`, `gh pr merge`, or pushed new commits to a
  contract-affecting PR.
- You observe a fresh contract-affecting diff on a PR or a merge commit on
  `origin/main` whose changed paths match the allowlist below.

Also invoke when the user types `/admin-log`, `/decision-log`, or directly
asks to "log this PR to admin decision log".

The same script runs in CI via `.github/workflows/decision-log-auto-draft.yml`
on every PR open/synchronize/reopen and commits the auto-draft back to the PR
branch. The skill prose below describes the local-agent equivalent; both paths
write the same files.

Do **not** invoke the script for PRs that only touch product/UI/test/tooling
code. The allowlist below decides; if nothing matches, the script exits with
"No contract-affecting paths in PR #N. Skipping decision log draft." and no
entry is written.

`/about/changes` is **not** a separate trigger — the script auto-detects
`userFacing` from the changed code's `// @promise` tags and the matched
Promises' lanes. When the detection fires, the script writes both an admin
decision-log entry and an `/about/changes` entry with TODO prose. When it
does not, the script writes only the admin entry. The agent (or human) fills
the TODO prose during review.

### Contract-affecting allowlist

(Maintained inside `scripts/decision-log/draft-from-pr.ts` — kept in sync
with this list.)

- `docs/contracts/**`
- `docs/principles.md`
- `docs/mission-control.md`
- `docs/intent-traceability.md`
- `docs/conventions.md`
- `docs/verification-gates.md`
- `docs/runtime-flows/**`
- `docs/agent-skills.md`
- `docs/analytics/wire-retire-exempt-decision-tree.md`
- `docs/analytics/events.yaml`
- `AGENTS.md`
- `CLAUDE.md`

Exclusions: generated `*.generated.md`, snapshots, `__tests__/`, `*.test.*`.

### When a contract-affecting PR is still exempt

The allowlist fires by path, not by intent. Some PRs touch contract paths
only because mechanism changes have to be mirrored — the _semantic_ contract
is unchanged. Examples:

- A CI workflow refactor (sequential → matrix, runner config, timeout cap)
  that rewords an AC body to describe the new mechanism while preserving
  the same invariant.
- An Evidence Ledger row update that swaps which test name is asserted
  because the underlying test was renamed or split.
- A governance stub event added to `docs/analytics/events.yaml` purely to
  satisfy the `mc:event-impact` gate when a Promise lane is `admin` /
  `governance` and no user-facing trigger exists.
- A `judgeOverride:` line added to a Promise/Ledger to record a known
  static-judge false-positive.

In these cases there is no product/policy/feature decision worth surfacing
on `/admin/decision-log`. Adding an entry would dilute the log with
infrastructure churn. The exemption is recorded as a Git trailer so the
audit trail still exists:

```
Decision-Log-Exempt: <one-line reason describing why this PR has no user/product decision>
```

Place the trailer on any one commit in the PR (or in the PR body). Both
`decision-log:draft` (skill + workflow) and `decision-log:check` (merge
gate) honor it. Do **not** use the trailer for:

- New or changed user-visible behavior (always log).
- Promise/Aspect _meaning_ changes (always log).
- New or removed Acceptance Checks (always log).
- Policy or process changes recorded in `docs/principles.md`,
  `docs/mission-control.md`, `AGENTS.md`, etc. (always log).

Use it only when honestly nothing on `/admin/decision-log` would help a
beta tester or operator understand what changed in the product.

## Workflow

The script does the mechanical work (entry id, contract diff hunks, PR title,
source, userFacing detection, `/about/changes` skeleton). The agent or human
fills the TODO prose afterward.

1. Identify the PR number.
   - Prefer the explicit PR number from the user.
   - If absent, use `npm run decision-log:draft -- --auto`, which picks the
     most recently merged PR on `base=main`.
2. Run the draft script on the PR branch.

   ```bash
   npm run decision-log:draft -- <PR#>
   ```

   The script writes mechanical fields (id, paths, contract diff hunks, PR
   title, source) into
   `app/(admin)/admin/decision-log/admin-decision-log-entries.ts` and
   `app/i18n/messages/commitment-admin-decision-log.ts`. It also inspects the
   changed `app/**/*.{ts,tsx}` files for `// @promise` tags, resolves each
   slug to `docs/contracts/story-chain/promises/<slug>.md`, and reads the
   `lane:` value. When at least one matched Promise carries a user-facing
   lane (`search`, `workspace`, `pdf`, or a researcher-prefixed `other`
   lane), the script also injects an `/about/changes` entry skeleton into
   `app/about/changes/page.tsx` and i18n keys into
   `app/i18n/messages/commitment.ts`. All prose fields land as `TODO:`.

3. If the script exits "No contract-affecting paths…", stop. Do not log the
   PR.

4. Replace the `TODO:` prose fields with PR-specific narrative. Ground each
   field in PR data, not invention. **Do not name individual users.** When
   prose describes feedback that drove the work, write "사용자들 의견" /
   "user feedback" rather than naming a specific reviewer, beta tester, or
   internal teammate — even in the internal `/admin/decision-log` surface.
   The same rule applies to the `/about/changes` entry and to any commit
   messages this skill writes. Drop "베타 테스터", "한 베타 테스터",
   "Donggyu", real names, GitHub handles, or any phrasing that identifies
   a specific feedback source. Refer to plans, issues, or PR numbers by
   their neutral identifiers when needed (e.g. "GitHub PR #56",
   "issue #29") instead of personal labels. Also rename the placeholder
   slug (`<date>-pr-<N>` / `<date>-pr-<N>-feedback`) to a content-based
   slug — e.g. `2026-05-15-search-and-gap-feedback` — and update both the
   `id`/`keyPrefix` in the page files and the i18n keys to match.

   Admin decision-log fields:
   - `summary` — pull the first paragraph from the PR body; tighten to one
     paragraph in Korean.
   - `source` — PR / experiment / review thread that surfaced the work.
   - `planPath` — only if the PR has a canonical plan/record file
     (`docs/contracts/.../*-record.md`, `docs/contracts/.../plan.md`). Empty
     string if none.
   - `reviewQuestion.q1`–`q4` — questions a reviewer should be able to answer
     "yes" to after reading the PR. Drawn from PR judgment + verification
     section.
   - `issue.<N>.request` / `judgment` / `decision` / `implemented` —
     four-part decision narrative. Each ≤ 3 sentences. Use Korean.

   `/about/changes` fields (only when the script auto-injected the skeleton):
   - `title` / `summary` — match the format of recent entries
     (e.g. `2026-05-13`, `2026-05-14-*`): user-perspective Korean prose,
     no internal jargon, no real names.
   - `request.body` / `decision.body` / `implemented.body` — three-part
     researcher-facing narrative, parallel to the admin four-part block but
     scoped to what the user actually sees on screen.
   - `item.*` — short bullet lines, one per visible change. Drop or add
     `detailKeys` in `page.tsx` to match.
   - Update `docs/contracts/story-chain/promises/researcher-product-changelog-page.md`
     and `docs/contracts/story-chain/evidence-ledgers/commitment-pages.ledger.md`
     only if the visible changelog contract changes (new section shape,
     new required field). A new dated entry inside the existing shape does
     not require a contract edit.
   - Tighten `app/about/__tests__/changes-page.test.tsx` if you assert on
     specific entry content.

5. Validate.

   ```bash
   npm run format:check
   npm run lint
   npm run typecheck
   ```

   No new gates needed — decision log and `/about/changes` are product code
   under the `internal-decision-log-page` and
   `researcher-product-changelog-page` Promises.

6. Commit. When the script ran in CI (auto-draft workflow), the workflow
   commits the skeleton back to the PR branch; the agent then opens a
   follow-up commit on the same PR with the prose. When the script ran
   locally on the source PR branch, commit directly to that branch.

   ```bash
   git add app/\(admin\)/admin/decision-log/ \
           app/i18n/messages/commitment-admin-decision-log.ts \
           app/about/changes/page.tsx \
           app/i18n/messages/commitment.ts
   git commit -m "feat(decision-log): log PR #<PR#>"
   ```

7. Tell the user what was filled and what remains. Mention which `TODO:`
   fields you replaced and which (if any) you left for the human to fill
   (e.g., when the PR didn't actually have a `planPath`, the judgment was
   unclear, or the `userFacing` detection was ambiguous).

## Boundaries

- **Always** — keep the admin entry inside `BETA_RESPONSE_ENTRIES`. Append at
  the end of the array; rendering sorts by id desc at view time so the data
  remains append-only.
- **Always** — `/about/changes` entries go at the **top** of
  `CHANGELOG_ENTRIES` (the array order is the display order; there is no
  render-time sort). The auto-draft script handles this.
- **Always** — `/admin/decision-log` is the source of truth.
  `/about/changes` is a user-facing subset. The script writes both in the
  same pass when `userFacing` is detected; do not author `/about/changes`
  without the matching admin entry.
- **Always** — anonymize feedback sources in prose. No real names, GitHub
  handles, "beta tester / 베타 테스터 / 한 베타 테스터", or other
  personal identifiers in title, summary, request, judgment, decision,
  implemented, review questions, or the slug/id. Use "사용자들 의견" /
  "user feedback" plus neutral references (PR number, issue number, plan
  path) instead. The internal `/admin/decision-log` surface and the
  public `/about/changes` entry follow the same rule.
- **Never** — invent contract changes that weren't in the PR diff. Never
  silence the `TODO:` markers by writing generic prose ("정합성을 개선했다");
  if you can't ground a field in PR data, leave the `TODO:` and report it.
- **Never** — drift the admin entry and the `/about/changes` entry. Same
  source PR, same source feedback, same anonymization rule.
- **Ask first** — if the PR is contract-affecting but its decisions span
  multiple lanes (e.g., one PR closes 4 issues with separate judgments), ask
  the user whether to split into multiple `IssueCard`s or one composite card.
- **Ask first** — when `userFacing` auto-detection fires on a PR that the
  user clearly considers internal-only (or vice versa), confirm before
  manually removing or adding the `/about/changes` skeleton.

## Validation

Local gates:

```bash
npm run format:check
npm run lint
npm run typecheck
```

The new entry will be visible at `/admin/decision-log` (admin-only route gated by
`requireInternalAdminUser`). For interactive verification, hit the route on
the preview deploy after the follow-up PR opens.

## Files

- `scripts/decision-log/draft-from-pr.ts` — CLI implementation. Owns
  contract-path allowlist, `userFacing` lane detection, and both inject
  paths.
- `.github/workflows/decision-log-auto-draft.yml` — CI auto-draft workflow.
  Runs the script on PR open/synchronize/reopen and commits the draft back
  to the PR branch.
- `app/(admin)/admin/decision-log/admin-decision-log-entries.ts` — admin
  Entry array (write target). The presentational view
  `app/(admin)/admin/decision-log/AdminDecisionLogView.tsx` imports the
  array from this sibling module so the view file stays under the
  `max-lines: 700` ESLint cap as entries grow.
- `app/i18n/messages/commitment-admin-decision-log.ts` — admin i18n message
  catalog (write target).
- `app/about/changes/page.tsx` — `/about/changes` CHANGELOG_ENTRIES array
  (write target when userFacing).
- `app/i18n/messages/commitment.ts` — `/about/changes` i18n message catalog
  (write target when userFacing).
- `app/(admin)/admin/decision-log/page.tsx` — admin route gated by
  `requireInternalAdminUser`.
