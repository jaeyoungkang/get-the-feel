"use client";

import { useEffect, useRef, useState } from "react";

// @promise promise:sense-training-surface
// @aspect aspect:design-baseline-preservation
// @check acceptance-check:sense-training-surface-current-build
type HomeTrainerFrameProps = {
  src: string;
};

export function HomeTrainerFrame({ src }: HomeTrainerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("100dvh");

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "gtf:height" && Number.isFinite(data.height)) {
        setHeight(`${Math.max(Number(data.height), window.innerHeight)}px`);
      }

      if (data.type === "gtf:scroll-to" && Number.isFinite(data.top)) {
        const frameTop = iframeRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, frameTop + Number(data.top)),
          behavior: data.behavior === "smooth" ? "smooth" : "auto",
        });
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function requestHeight() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "gtf:height-request" },
      window.location.origin,
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="trainer-frame"
      src={src}
      title="get-the-feel trainer"
      style={{ height }}
      onLoad={requestHeight}
    />
  );
}
