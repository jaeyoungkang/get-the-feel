# Sample Pack

> 본구현 전에 representative·contrast·edge sample로 추상을 구체화하는 정본 문서

## Purpose

- 이 샘플 팩이 왜 필요한가
- 이 샘플이 답해야 하는 질문은 무엇인가
- 계약 문서만으로 아직 닫히지 않은 추상은 무엇인가

## Inputs

- `docs/PRODUCT.md`
- `docs/contracts/story-chain/experiences/<slug>.md`
- `docs/contracts/story-chain/moments/<slug>.md`
- `docs/contracts/story-chain/promises/<slug>.md`
- `docs/contracts/story-chain/aspects/<slug>.md`
- `docs/contracts/feature-specs.md` (AC ledger)
- `docs/design-principles.md`
- 실제 source artifact 또는 reference

## Sample Matrix

| Sample ID | Type | Source / Reference | Why Included | Questions Answered |
|---|---|---|---|---|
| `S-001` | representative |  |  |  |
| `S-002` | contrast |  |  |  |
| `S-003` | edge |  |  |  |

## Workflow Coverage

샘플이 화면이나 산출물 한 조각만 보여주면 bootstrap-ready가 아니다. 제품이 입력을
받아 판단하거나 결과를 내는 흐름을 가진다면, 샘플 수준에서 아래 흐름을 닫는다.

| Workflow Slice | Sample Artifact | Finding |
| --- | --- | --- |
| 입력/source |  |  |
| 파싱/정규화 |  |  |
| 근거/규칙/판단 basis |  |  |
| 제품 판정 |  |  |
| 사용자-facing output |  |  |
| export/handoff |  |  |

## Representative Samples

- 가장 정상적이고 타깃에 가까운 샘플
- 이 샘플이 보여주는 artifact shape / surface shape / evidence shape

## Contrast / Anti-Examples

- 경계를 선명하게 만드는 샘플
- 닮아 보이지만 이 제품이 되면 안 되는 형태

## Edge / Failure Samples

- linkage 누락
- sparse data
- malformed source
- evidence 부족

## Candidate Surface Samples

- 표현 방식이 blocker일 때만 작성
- low-fidelity 비교면 충분하다
- 구현 디테일이 아니라 읽기 방식과 정보 구조를 보여준다

## Findings

### Locked

- 

### R&D Required

- 

### Unresolved

- 

## Next Handoff

- `project-bootstrap` 로 넘길 수 있는가
- bootstrap 기술 선택으로 넘길 수 있는가
- `contract-authoring` 로 되돌아가야 하는가
