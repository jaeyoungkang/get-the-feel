# fix_plan — 작업 큐

**규율**: 한 turn = 한 항목 = 한 commit (`docs/principles.md` Atomic Step).

식별자: `<카테고리>-<번호>`.

---

## 대기 중 (Pending)

- [ ] **init-1** `git init -b main` + 첫 commit — 초안 (codex exec 1·2·3차 리뷰 반영 완료)

---

## 진행 중 (In Progress)

없음.

---

## 완료 (Done)

비었다 (첫 commit 후 채워짐).

---

## 제안 (Proposals — 합의 필요, 에이전트 skip)

비었다.

추가 패턴:
- `제안: <파일> — <변경 취지>`
- `제안: 신규 원리 — <이름> — <식별된 LLM 이탈 패턴 + 운영 증거>`
- `제안: 신규 스킬 — <이름> — <어느 원리·메타 프로세스의 행동 인스턴스인가>`

이 섹션 / `제안:` 접두어 항목은 **에이전트가 skip**.

---

## 운영 메모

- 새 항목은 Refinement Loop의 비대화 방지 셀프 게이트(`docs/principles.md`) 통과 후에만 큐에 올림
- 운영·전파·매핑 노트 같은 후속 작업은 발생 시점에 큐에 올림. 사전에 가상의 phase로 적재하지 않는다.
