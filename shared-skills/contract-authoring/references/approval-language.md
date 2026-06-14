# Approval Language

Use compact approval commands when the user is moving quickly.

## Commands to recognize

- `승인`
- `보류`
- `폐기`
- `이건 빼`
- `다음으로`
- `이 둘 중 A`
- `이건 unresolved로`
- `이건 PRODUCT에만 반영`
- `이건 US로 내려`
- `실제 소스 기준으로`
- `정본으로 올려`
- `draft만 남겨`

Interpret these as workflow control, not casual prose.

## Approval pass output

When the user is reviewing a draft, respond in this shape:

1. accepted
2. changed
3. held
4. removed
5. unresolved
6. next artifact or next question

## Example

If the user says:

- "Why는 승인"
- "Target은 좀 좁혀"
- "이 기능은 빼"
- "이건 아직 모르겠다"

Then summarize:

- accepted: Why
- changed: Target needs narrowing
- removed: that feature
- unresolved: that unknown item

Then either revise the same artifact or move to the next smallest stable artifact.

## Midstream change handling

If the user adds a large new requirement after approving earlier drafts, do not treat it as a tiny edit.

Instead:

1. acknowledge the affected artifact layer
2. switch to `revision` mode
3. say what became stale
4. revise upward before continuing downward
