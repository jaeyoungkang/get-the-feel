import Link from "next/link";

import { currentCorpusSummary } from "@/src/content/corpus-summary";

// @promise promise:sense-training-surface
// @check acceptance-check:sense-training-surface-current-build
export default function HomePage() {
  return (
    <main className="trainer-shell">
      <header className="trainer-header" aria-label="Current product build">
        <div>
          <p className="eyebrow">Current representative build</p>
          <h1>get-the-feel</h1>
          <p className="summary">
            c4-3 · {currentCorpusSummary.files} files ·{" "}
            {currentCorpusSummary.senses} senses · {currentCorpusSummary.items} items
          </p>
        </div>
        <nav className="header-actions" aria-label="Project routes">
          <Link href="/explain">Explain</Link>
          <Link href="/status">Status</Link>
          <a href="/legacy/c4-3/index.html">Open standalone</a>
        </nav>
      </header>
      <iframe
        className="legacy-frame"
        src="/legacy/c4-3/index.html"
        title="get-the-feel c4-3 training app"
      />
    </main>
  );
}
