# Domain Layer Activation Guide

product-weaver는 도메인 베이스에 단일 하네스를 강제하지 않는다. 도메인은
`docs/principles.md`의 4원리를 자기 프로젝트에 맞는 산출물, ledger, gate, skill로
인스턴스화한다.

이 문서는 새 원리나 공통 프로세스가 아니다. 도메인 인스턴스가 자기
**Harness Case**를 남길 때 참고하는 짧은 가이드다.

## Harness Case

Harness Case는 도메인 베이스가 선택한 process subset 기록이다. UP/RUP의
Development Case에서 가져올 수 있는 점은 이것 하나다. 전체 방법론을 가져오지
않고, 프로젝트에 맞게 어떤 부분을 켰는지 명시한다.

Harness Case는 다음 질문에 답한다.

- 어떤 Intent Lock 산출물을 쓰는가.
- Gap Ledger는 어디에 두는가.
- Mechanical Verdict는 어떤 gate나 review로 실행되는가.
- 어떤 운영 절차나 내부 보증 레이어를 켰는가.
- 무엇을 의도적으로 거부했는가.

이 기록은 도메인 AGENTS.md, 작업 큐, 제품 계약 자산 중 도메인이 정한 위치에 둔다.
product-weaver 본체에 도메인별 Harness Case를 모으지 않는다.

## 켜는 기준

새 레이어는 반복 위험이 있을 때만 켠다.

- 같은 의도 이탈이 반복된다.
- 같은 검증 공백이 반복된다.
- 같은 운영 절차를 사람이 반복 설명한다.
- 외부 자료의 최신성이 제품 약속이나 기술 선택을 좌우한다.

한 번 나온 특수 케이스는 새 레이어로 승격하지 않는다. 기존 4원리의
인스턴스화로 충분하면 도메인에만 둔다.

## 외부 리서치

인터넷, vendor docs, 논문, release note는 의사결정 근거가 될 수 있다. 다만
외부 자료는 바로 제품 계약이나 검증 증거가 되지 않는다.

- 제품 의미에 영향을 주면 Intent Lock 산출물로 번역하고 승인받는다.
- 검증에 영향을 주면 프로젝트 안에서 재현 가능한 command, artifact, review
  output으로 바꾼다.
- 시간이 지나면 바뀔 수 있는 정보는 출처, 날짜, 버전을 남긴다.
- 출처가 충돌하면 결론으로 덮지 말고 Gap Ledger나 작업 큐에 빈자리로 남긴다.

## 가져오지 않을 것

UP/RUP에서 다음은 가져오지 않는다.

- phase, role, artifact catalog
- UML이나 modeling 기본값
- 모든 도메인에 같은 lifecycle을 강제하는 방식
- 문서 milestone을 Mechanical Verdict보다 위에 두는 방식

product-weaver가 가져올 것은 tailoring 언어뿐이다. 도메인은 무엇을 켰는지와
무엇을 거부했는지를 명시한다.
