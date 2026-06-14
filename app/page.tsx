// @promise promise:sense-training-surface
// @aspect aspect:design-baseline-preservation
// @check acceptance-check:sense-training-surface-current-build
export default function HomePage() {
  return (
    <main className="trainer-frame-shell">
      <iframe
        className="trainer-frame"
        src="/legacy/c4-3/index.html"
        title="get-the-feel trainer"
      />
    </main>
  );
}
