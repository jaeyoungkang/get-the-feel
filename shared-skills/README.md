# Shared Skills

`shared-skills/`는 Claude Code와 Codex가 함께 쓰는 스킬의 정본이다.

- 수정은 `shared-skills/<skill-name>/`에서만 한다.
- 배포는 `python3 scripts/sync-agent-skills.py`로 한다.
- 스크립트는 정본을 `.claude/skills/`와 `.agents/skills/`로 복제한다.
- 생성된 디렉토리에는 `.skill-sync-generated` 마커가 생긴다. 이 경로는 직접 수정하지 않는다.

## 설계 원칙

- `SKILL.md` 본문은 Agent Skills 표준 범위 안에서 유지한다.
- Claude 전용 확장은 정말 필요할 때만 추가하고, 공용 코어에 의존성을 만들지 않는다.
- Codex 전용 UI 메타데이터는 선택 사항으로 둔다.
- 긴 절차서는 `references/`로 분리한다.

## 기존 `projects/skills`와의 관계

- `projects/skills/*/program.md`는 개념적 작업 절차 자산이다.
- `shared-skills/*/SKILL.md`는 실제 에이전트 런타임이 읽는 실행 포맷이다.
- 필요하면 기존 `program.md`를 `references/`로 옮기거나 요약해서 래핑한다.
