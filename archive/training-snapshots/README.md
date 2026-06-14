# Training Snapshots

Training snapshots preserve earlier runnable trainer states and the current
compatibility trainer.

## Active Compatibility Evidence

- `c4-3/`: 현재 Next shell이 임베드하는 trainer snapshot의 근거.
  `scripts/training-snapshots/sync-current.mjs`가 이 폴더를 `public/legacy/c4-3/`로
  복사한다.

## Closed Evidence

- `closed/c1-1/`
- `closed/c1-2/`
- `closed/c2-1/`
- `closed/c2-2/`
- `closed/c2-3/`
- `closed/c4-1/`
- `closed/c4-2/`

Historical snapshots keep their closing `cycle-record.md` and static files.
현재 제품 behavior를 고치기 위해 이 폴더를 패치하지 않는다.
