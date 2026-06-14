// @promise promise:sense-training-surface
// @aspect aspect:design-baseline-preservation
// @check acceptance-check:sense-training-surface-current-build
import { HomeTrainerFrame } from "./home-trainer-frame";

export default function HomePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const trainerSrc = `${basePath}/legacy/c4-3/index.html`;

  return (
    <main className="trainer-frame-shell">
      <HomeTrainerFrame src={trainerSrc} />
    </main>
  );
}
