# 계보 (Lineage)

product-weaver는 갑자기 만들어진 것이 아니라, lighthouse와 agentic-base에서 검증된 LLM 규제 패턴을 시간 축으로 더 압축한 결과다.

## 시간선

```
lighthouse (도메인 — 연구 보조)
  └─ 도메인 안에서 Intent Weaving · 정합성 검증 패턴 검증

         ↓ 일반화 시도 (2026-04 ~ 2026-05)

agentic-base (베이스 — AI 제품 init)
  └─ lighthouse의 검증 자산을 도메인-중립 형태로 이식
  └─ 결과: lighthouse 도메인 자산이 "일반화 외피"를 두르고 묻혀 들어옴 →
     베이스가 비대해짐.

         ↓ 추상화 한 단계 더 (2026-05-26)

product-weaver (베이스의 베이스 — LLM 규제 골격)
  └─ "소수의 규칙으로 복잡함이 창발해야 한다"는 정신에서 출발
  └─ LLM 불확실성의 본질을 의도 이탈로 정의
  └─ 4원리 + Refinement Loop 1개로 압축
```

## 추상화 근거 (요약)

agentic-base의 도구들을 LLM 이탈 패턴 기준으로 분류해 본 결과, 거의 모든 도구가 4원리 + Refinement Loop의 **도메인 인스턴스**라는 점이 드러났다.

- Intent Lock 인스턴스화: 제품 정체성 문서, 약속, 샘플 artifact, 엔지니어링 결정 문서 등
- Gap Ledger 인스턴스화: 검증 원장, 변경 로그, 운영 피드백 ledger 등
- Mechanical Verdict 인스턴스화: 정합성 CLI, CI gate, 배선 검증 등
- Preflight Gate 인스턴스화: bootstrap·release 직전 산출물 확인 게이트
- Atomic Step 인스턴스화: 작업 큐 + 1 turn 1 commit 운영
- Refuse First 인스턴스화: AGENTS.md Boundaries, 판단 스킬
- Refinement Loop 인스턴스화: 운영 피드백 ledger + 정기 회고

상세 매핑은 `references/<인스턴스>.md` 에서 도메인 운영 결과 누적 후 작성한다. 베이스에는 두지 않는다.
