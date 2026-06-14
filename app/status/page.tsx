import Link from "next/link";

import { currentCorpusSummary } from "@/src/content/corpus-summary";

export default function StatusPage() {
  return (
    <main className="status-page">
      <Link className="back-link" href="/">
        Back to trainer
      </Link>
      <h1>Project Status</h1>
      <p>
        Formal product development now starts from the c4-3 representative build,
        while earlier prototypes remain archived under{" "}
        <code>archive/prototypes/</code>.
      </p>
      <dl className="status-grid">
        <div>
          <dt>Representative</dt>
          <dd>archive/prototypes/c4-3</dd>
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
          <dd>demand-1 remains separate; engineering now uses app/src/public/scripts.</dd>
        </div>
      </dl>
    </main>
  );
}
