# Engineering Assurance Contracts

이 디렉토리는 Story Chain을 보완하는 하위 engineering assurance 계약 계층이다.

Story Chain은 사용자나 운영자가 관찰할 수 있는 Promise의 의미를 소유한다.
Engineering Assurance는 그 Promise를 깨뜨리지 않기 위해 시스템 내부에서 항상
지켜야 하는 invariant, lifecycle, operational control, evidence kind vocabulary를
소유한다.

## 현재 상태

- status: optional parse-only adoption
- release-blocking: no
- validator: Mission Control이 ID, frontmatter, 필수 섹션, 1차 참조 무결성을 warning으로 검사한다.

이 계층은 모든 프로젝트에 기본으로 강제되는 제품 계약이 아니다. VM, 결제, 배포,
데이터 migration, scheduler, 백업, 보안 경계처럼 제품 Promise를 지탱하는 내부
보증이 반복될 때 켠다.

권한 지도는 `docs/contract-maps/engineering-assurance.md`를 따른다. 변경 작업은
`shared-skills/engineering-assurance-steward/SKILL.md`로 라우팅한다.

## Layout

```text
docs/contracts/engineering/
  README.md
  assurance-claims/
    _TEMPLATE.md
  lifecycles/
    _TEMPLATE.md
  controls/
    _TEMPLATE.md
  evidence-kinds.md
```

## 참조 도메인

| 참조 | 파일 |
| --- | --- |
| `assurance-claim:<slug>` | `assurance-claims/<slug>.md` |
| `lifecycle:<slug>` | `lifecycles/<slug>.md` |
| `control:<slug>` | `controls/<slug>.md` |

## 책임 경계

- Promise는 사용자나 운영자가 관찰할 수 있는 결과를 말한다.
- Assurance Claim은 그 Promise를 지탱하는 내부 invariant를 말한다.
- Lifecycle은 시간에 따른 상태 전이를 말한다.
- Operational Control은 운영자 또는 시스템이 실행하거나 감사해야 하는 절차를 말한다.
- Evidence Ledger는 Story Chain과 Engineering Assurance를 실제 evidence로 닫는다.

## Adoption Phase

1. Source docs and templates only.
2. Parse-only Mission Control warnings for malformed IDs, duplicate IDs, missing sections, and missing references.
3. Reference integrity warnings from Promise and Evidence Ledger frontmatter.
4. After at least one closed slice proves the pattern, consider blocking only `met` verdict claims with broken Engineering Assurance references.

Unknown or draft engineering nodes must not block release by themselves. Blocking applies only when a project claims a Promise or Evidence Ledger is `met` and the required supporting claim/control/evidence kind is missing or invalid.
