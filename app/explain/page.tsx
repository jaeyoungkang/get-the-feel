import Link from "next/link";

import { SentenceExplainer } from "./sentence-explainer";
import { explanationSeedMatches } from "@/src/content/explanation-index";

// @promise promise:sentence-explanation-to-practice
// @check acceptance-check:sentence-explanation-route
export default function ExplainPage() {
  return (
    <main className="explain-page">
      <header className="explain-header">
        <div>
          <p className="eyebrow">Sentence to practice</p>
          <h1>문장 해설</h1>
        </div>
        <nav className="header-actions" aria-label="Project routes">
          <Link href="/">Trainer</Link>
          <Link href="/status">Status</Link>
        </nav>
      </header>
      <SentenceExplainer seedMatches={explanationSeedMatches} />
    </main>
  );
}
