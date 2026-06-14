# Deferred Verification Triggers

이 문서는 지금 당장 들여오지 않는 검증 아이디어의 트리거를 보관한다.
agentic-base는 Evidence Ledger runner와 Story Chain validator를 단순한
형태로 유지하는 것을 기본으로 두고, 아래 트리거 중 하나가 발생할 때만
해당 검증 아이디어를 본격 도입한다.

## Format

```markdown
## <검증 아이디어 이름>

지금 도입하지 않는 이유:
- ...

도입 트리거 (아래 중 하나라도 발생 시 검토):
- ...
```

## 등록 시점

- 어떤 검증 아이디어가 매력적이지만 현재 제품 규모에서는 과잉인 경우
- 도입했을 때 코드/문서 무게가 sample-first → bootstrap → propagation 흐름을 느리게 만들 가능성이 있는 경우
- 동일 패턴이 N회 반복되면 도입 가치가 자명해지는 경우

## Active Entries (도메인-중립 시드)

agentic-base는 기본 entry를 두지 않는다. 첫 파일럿이 굴러가는 중 발견되는 검증 아이디어를 이곳에 적재한다.

---

> entry 사례는 새 프로젝트의 실제 deferred verification 지점이 생길 때만 추가한다.
