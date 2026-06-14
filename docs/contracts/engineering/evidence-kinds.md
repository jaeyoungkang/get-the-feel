# Engineering Evidence Kinds

이 문서는 Story Chain evidence vocabulary를 대체하지 않고 확장한다.

현재 Mission Control은 이 표의 존재와 기본 형식을 parse-only로 다룬다. `conditional`
kind는 최소 필드와 validator가 정의되기 전까지 release-eligible evidence로 승격하지
않는다.

| kind | releaseEligible | meaning |
| --- | --- | --- |
| `runtime-output` | yes | 실제 runtime 경로 출력, test runner 출력, tool-call 결과 |
| `rendered-dom` | yes | 실제 UI가 렌더한 DOM evidence |
| `human-approval` | aspect-meaning-only | Human이 승인한 의미. 실행 가능한 제품 동작 evidence는 아님 |
| `migration-output` | conditional | target env, before/after version, exit code, rollback note를 포함한 migration command output |
| `deploy-health-output` | conditional | deploy ref, env target, compose state, health result |
| `webhook-replay-output` | conditional | signature, duplicate event, state transition replay evidence |
| `scheduler-run-output` | conditional | idempotency 또는 cycle boundary를 증명하는 scheduled job execution |
| `audit-log-sample` | conditional | 구체 scenario에 연결된 operational audit entry |
