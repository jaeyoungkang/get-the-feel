import Link from "next/link";

import { currentCorpusSummary } from "@/src/content/corpus-summary";
import { Trainer } from "./trainer";

// @promise promise:sense-training-surface
// @check acceptance-check:sense-training-surface-current-build
export default function HomePage() {
  return (
    <main className="trainer-shell">
      <header className="trainer-header" aria-label="Current product build">
        <div>
          <p className="eyebrow">Current product build</p>
          <h1>get-the-feel</h1>
          <p className="summary">
            {currentCorpusSummary.files} files ·{" "}
            {currentCorpusSummary.senses} senses · {currentCorpusSummary.items} items
          </p>
        </div>
        <nav className="header-actions" aria-label="Project routes">
          <Link href="/explain">Explain</Link>
          <Link href="/status">Status</Link>
        </nav>
      </header>
      <Trainer />
    </main>
  );
}
