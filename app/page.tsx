import Link from "next/link";

import { currentCorpusSummary } from "@/src/content/corpus-summary";
import { Trainer } from "./trainer";

// @promise promise:sense-training-surface
// @check acceptance-check:sense-training-surface-current-build
export default function HomePage() {
  return (
    <main className="trainer-shell">
      <header className="trainer-header card" aria-label="Current product build">
        <div>
          <p className="eyebrow">get-the-feel</p>
          <h1>11개 감각으로 영어 동사 익히고 써 보기</h1>
          <p className="summary">
            have · get · take · make · keep · be · go · come / up · out / V+up
            <br />
            {currentCorpusSummary.senses}개 감각 · {currentCorpusSummary.items}문장
          </p>
        </div>
        <nav className="header-actions" aria-label="Project routes">
          <Link href="/explain">문장 해설</Link>
          <Link href="/status">도구 정보</Link>
        </nav>
      </header>
      <Trainer />
    </main>
  );
}
