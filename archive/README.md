# Archive

`archive/`는 현재 제품 개발의 source가 아니다. 보관 목적은 두 가지다.

| Path | Role |
| --- | --- |
| `training-snapshots/c4-3/` | 현재 trainer snapshot. `npm run snapshot:sync`가 여기서 `public/legacy/c4-3/`를 생성한다. 직접 패치하지 않는다. |
| `training-snapshots/closed/` | c1~c4-2 historical trainer snapshots. 마감 시점 record와 verdict 결과를 보존한다. 새 제품 작업의 입력으로 쓰지 않는다. |
| `historical methodology/` | historical 운영 문서. 현재 운영 기준은 Story Chain + Mission Control이다. |

## Rules

- 새 기능은 `app/`, `src/`, `assets/`, `docs/contracts/story-chain/`에서 만든다.
- `archive/training-snapshots/c4-3/`는 호환 레이어의 근거로만 읽는다.
- `archive/training-snapshots/closed/`와 `archive/historical-methodology/`는 역사 증거다. 새 판단은
  필요한 교훈만 Story Chain, product, assets, docs로 회수한 뒤 진행한다.
