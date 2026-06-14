import Link from "next/link";

import { currentCorpusSummary } from "@/src/content/corpus-summary";

export default function StatusPage() {
  return (
    <main className="status-page">
      <Link className="back-link" href="/">
        Back to trainer
      </Link>
      <Link className="back-link" href="/explain">
        Sentence explainer
      </Link>
      <h1>Project Status</h1>
      <p>
        Formal product development starts from Story Chain contracts and the
        active Next/React trainer surface.
      </p>
      <dl className="status-grid">
        <div>
          <dt>Representative</dt>
          <dd>Native trainer and sentence explanation flow</dd>
        </div>
        <div>
          <dt>Content</dt>
          <dd>
            {currentCorpusSummary.files} files, {currentCorpusSummary.senses} senses,{" "}
            {currentCorpusSummary.items} items
          </dd>
        </div>
        <div>
          <dt>Source review</dt>
          <dd>
            {currentCorpusSummary.validation.strong} strong /{" "}
            {currentCorpusSummary.validation.weak} weak senses
          </dd>
        </div>
        <div>
          <dt>Next product work</dt>
          <dd>demand-1 remains separate; engineering now uses app, src, assets, and scripts.</dd>
        </div>
      </dl>
    </main>
  );
}
