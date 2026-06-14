---
name: project-knowledge
description: Light House의 Project Knowledge를 로드, 갱신, 후보화, review할 때 사용한다. 기본 작업 기억은 .project-knowledge-local/work-memory.md에 한국어 narrative로 남기고, repo 차원의 반복 판단만 docs/project-knowledge/shared-memory.md로 승격한다.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Project Knowledge Skill

이 스킬은 Light House의 Project Knowledge 흐름을 다룬다. 핵심 흐름은 `remember -> recall -> candidate -> review -> narrative`이며, 로컬 기억은 최신 요약과 append-only 로그를 분리한다.

## 파일

- 로컬 작업 기억: `.project-knowledge-local/work-memory.md`
- 로컬 작업 기억 로그 (append-only JSONL): `.project-knowledge-local/work-memory-log.jsonl`
- 월 단위 archive: `.project-knowledge-local/archive/work-memory-log-YYYY-MM.jsonl`
- 로컬 후보: `.project-knowledge-local/candidate.md`
- 공유 기억: `docs/project-knowledge/shared-memory.md`
- 안내 문서: `docs/project-knowledge/README.md`
- 스크립트: `scripts/project-knowledge/`

## 실행 흐름

1. 현재 컨텍스트에 Project Knowledge start 출력, 로컬 작업 기억, 또는 `project-knowledge-preprompt`가 없으면 첫 응답 전에 `npm run pk:start`를 실행한다.
2. `프로젝트 시작`, `project start`, `pk:start` 요청을 받으면 `npm run pk:start`를 실행한다.
3. 작업 전환, 커밋 전후, 컨텍스트 정리 시점에는 `npm run pk:remember -- --note "<한국어 narrative>"`를 실행한다. 이 명령은 최신 요약(`work-memory.md`)을 갱신하고 append-only JSONL 로그에 한 record를 추가한다. 월이 바뀌면 직전 월 jsonl이 `archive/work-memory-log-YYYY-MM.jsonl`로 자동 이동한다. 회상 키는 보통명사 확대가 아니라 구분력 있는 고유명사와 canonical id 중심으로 남긴다. 해당 기억의 핵심을 특정하는 사람, 조직, 제품, 라이브러리, 벤더, 서비스, 파일, 문서, Promise/AC id, 도구명이 있으면 `--entities`, `--goal-links`, `--context-hint`, `--role`, `--encoding-depth`를 함께 전달한다.
4. 과거 작업 기억이 필요하면 `npm run pk:recall -- <query>`를 실행한다. 기본 검색 범위는 최근 30일 + 공유 기억이고, archive를 포함하려면 `--all`, 시간 범위를 바꾸려면 `--since YYYY-MM-DD`를 쓴다.
5. 최근 N개 기억을 사람이 읽고 싶을 때는 `npm run pk:log -- --tail <N>`(archive 포함은 `--all`)로 jsonl을 markdown으로 렌더한다.
6. repo 차원의 반복 판단이 생기면 `npm run pk:checkpoint`로 `candidate.md`를 만든다.
7. 후보를 읽고 필요한 문장을 채운 뒤 `npm run pk:review -- --approve .project-knowledge-local/candidate.md`로 공유 기억에 승격한다.
8. 구조나 스크립트를 바꾼 뒤에는 `python3 scripts/sync-agent-skills.py`, `npm run guard:skills`, `npm run pk:validate`를 실행한다.

## `/clear` 대응

`/clear`는 기억 저장과 기억 복원의 두 단계로 다룬다.

컨텍스트를 비우기 전에는 agent가 현재 작업 흐름, 판단 전환, 다음 처리 순서를 한국어 narrative로 요약해 아래 명령을 실행한다.

```bash
npm run pk:remember -- --note "<한국어 narrative>"
```

컨텍스트를 비운 뒤 새 세션의 첫 응답 전에는 아래 명령을 실행한다.

```bash
npm run pk:start
```

필요한 과거 맥락이 최신 요약에 없으면 아래 명령으로 로컬 evidence까지 검색한다.

```bash
npm run pk:recall -- <query>
```

Claude Code에서는 clear 이후 다음 사용자 입력에도 복원 규칙이 들어오도록 `UserPromptSubmit` hook에서 아래 preprompt 명령을 실행할 수 있다. 이 preprompt는 매 턴 실행되지만, 같은 세션에서 로컬 작업 기억 내용이 바뀌지 않으면 축약된 unchanged preprompt만 주입한다. 작업 기억이 바뀌었거나 사용자 프롬프트가 재개/회상형이면 로컬 작업 기억 발췌와 `pk:start` 감지 규칙을 다시 주입한다. Hook output은 plain stdout 본문이 아니라 JSON `hookSpecificOutput.additionalContext`로 내보내 화면 노출을 줄인다.

```bash
npm run pk:preprompt --silent
```

Codex에서는 `UserPromptSubmit` hook context가 화면에 그대로 펼쳐질 수 있으므로 이 hook을 쓰지 않고 AGENTS preprompt와 이 스킬의 첫 응답 규칙으로 같은 동작을 수행한다. slash command hook을 제공하는 harness에서는 clear 직전 hook에 `pk:remember`를 연결하고, clear 직후 또는 session-start hook에 `pk:start`를 연결한다.

## 기억 작성 형식

기억은 한국어 narrative로 쓴다. git 정보는 본문이 아니라 근거다.

회상 키는 note 본문에만 맡기지 않는다. 작업 기억을 다시 불러야 할 고유명사나
정본 식별자가 있으면 구조화 필드에 명시한다.

- `--entities`: 검색 노이즈를 줄이기 위해 보통명사보다 고유명사와 canonical id를
  우선한다. 예: `PostHog`, `Amplitude`, `server-analytics`,
  `events.yaml`, `promise:story-chain-event-contract`,
  `acceptance-check:story-chain-event-contract-router-boundary`.
- `--domain-tags`: 넓은 검색어가 아니라 기억을 묶는 안정적인 영역을 1-4개만
  넣는다.
- `--goal-links`: Promise, Acceptance Check, issue, PR처럼 나중에 같은 목표로
  다시 찾을 식별자를 넣는다.
- `--context-hint`: 2-8단어 정도로 회상 상황을 좁힌다.

보통명사는 그 단어만으로 이 기억을 찾을 수 있을 때만 쓴다. `analytics`,
`contract`, `test`처럼 repo 전반에 넓게 걸리는 말은 단독 회상 키로 남기지
않는다.

```bash
npm run pk:remember -- --note "<한국어 narrative>" \
  --entities "PostHog,Amplitude,server-analytics,events.yaml,promise:story-chain-event-contract" \
  --domain-tags "analytics,story-chain" \
  --goal-links "acceptance-check:story-chain-event-contract-router-boundary" \
  --context-hint "PostHog removal sink migration" \
  --role "implementation-memory" \
  --encoding-depth "keywords"
```

공유 후보는 아래 골격을 사용한다.

```markdown
---
status: candidate
confidence: medium
last_reviewed: YYYY-MM-DD
source_refs:
  - commit:
  - file:
supersedes:
  -
---

# Narrative: [주제]

## 현재 형태

## 형성 과정

## 핵심 결정

## 다음 처리

## 주의 지점

## 근거
```

## 판단 기준

로컬 작업 기억에는 현재 작업 흐름, 판단 전환, 다음 처리 순서를 남긴다. 최신
요약은 `work-memory.md`, append-only 구조 로그는 `work-memory-log.jsonl`에
남긴다. 월이 바뀌면 직전 월 jsonl이 `archive/`로 자동 이동한다. 사람이 읽는
markdown 뷰는 별도 파일로 누적하지 않고 `npm run pk:log` 명령으로 jsonl에서
바로 렌더한다. JSONL record는 `type`, `date`, `title`, `summary`,
`context_hint`, `encoding_depth`, `role`, `domain_tags`, `entities`,
`goal_links`, `events`, `source_refs`를 가진다. 회상 키는 자동으로 넓게
추출하지 않는다. 대신 작업을 대표하는 고유명사와 정본 식별자가 뚜렷하면 agent가
직접 구조화 필드로 남긴다.

공유 기억에는 다음 기여자도 반복해서 참조할 프로젝트 운영 방식, agent 행동 기준, 구조 결정, 주의 지점을 남긴다.
