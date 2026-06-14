# 개발 방법론

> 전체 맥락은 `agentic-engineering-principles.md` 참조.

## 모든 것은 파일이다 (Everything is a File)

다양한 대상을 가능하면 동일한 추상화로 묶어 단순하게 만든다. 파일 자체가 목적이 아니라, **에이전트가 읽고 쓰고 diff하고 검증할 인터페이스를 하나로 수렴시키는 설계 판단**이 목적이다.

**시스템 인터페이스 — 파일로 노출하라:**
- 설정 → 파일. 하드코딩 금지
- 스키마 → 파일에 선언. 런타임 생성 회피
- 인프라 → 선언적 파일. GUI 설정 의존 금지
- 규칙 → 설정 파일로 강제. 구두 합의 금지

**코드 인터페이스 — 균일하게 구현하라:**
- 기존 패턴을 먼저 파악하고, 그 패턴을 따른다
- 새로운 인터페이스를 발명하지 않는다
- 특수 경로를 만들지 않는다 — 공통 경로를 통과시킨다

## 기술적 결 (Technical Grain)

제품의 본질과 기술이 강제하는 세계관이 맞물리는 정도. 맞으면 단순, 안 맞으면 우회·복잡성.

판단 기준:
1. 도메인이 리소스 중심인가, 워크플로 중심인가?
2. UX가 즉시 응답인가, 실행→대기→수정 반복인가?
3. 운영 관측이 가능한가?

## LLM 호출 이원화

| | 에이전트 수준 | 실행 수준 |
|---|---|---|
| 역할 | 전략적 판단 (plan/audit) | 응답 생성 + 도구 호출 (execute) |
| 구조 | `generateObject` (구조화 출력) | `streamText` (스트리밍 + tool use) |
| 관측 | 턴 단위 (turn_decisions에 기록) | 호출 단위 |
| 에러 | fallback 반환 | skip/throw |
| 확장 | 더 정교한 판단 | 더 많은 종류의 도구 |

두 수준을 섞지 않는다. 판단 LLM이 도구를 직접 부르면 관측이 꼬이고, 실행 LLM이 정책을 판단하면 에러가 전파된다.

---

## 스킬 배포 패턴

Claude Code·Codex 같은 에이전트 스킬(jaeyoung-think 등)을 **원본 1곳 → 에이전트별 디렉터리 N곳**으로 자동 동기화하는 패턴.

### 구조

```
shared-skills/                # 원본 (git 관리)
  <skill-name>/
    SKILL.md
    references/
    install.sh

.claude/skills/<skill-name>/  # Claude Code 로드 경로 (배포 복사본)
.agents/skills/<skill-name>/  # Codex 로드 경로 (배포 복사본)
```

### 동기화 스크립트

`scripts/sync-agent-skills.py` 같은 배포 스크립트가 `shared-skills/`를 읽어 각 에이전트 디렉터리로 복사·갱신.

### 원칙

1. **원본 단일**: `shared-skills/` 바깥에서 수정 금지. 에이전트 디렉터리는 복사본.
2. **커밋 대상**: 원본은 git 추적. 복사본은 `.gitignore` 또는 hook으로 자동 생성.
3. **멀티 에이전트 대응**: Cursor 추가 시 `.cursor/skills/` 같은 새 타깃만 추가. 원본은 그대로.
4. **스킬 간 의존 금지**: 스킬은 자체 완결. 다른 스킬을 import하지 않는다 — 에이전트가 일부만 로드해도 동작.

### 확장 포인트

- 스킬별 버전 관리 (major.minor.patch)
- 배포 대상 선택 (`sync --target=claude,codex`)
- 설치 검증 (`install.sh` 실행 후 스모크 테스트)
