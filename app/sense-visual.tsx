type SenseVisualProps = {
  senseId: string;
  item?: string;
};

function visualKind(senseId: string) {
  if (senseId.includes("arrival") || senseId.includes("toward")) return "arrival";
  if (senseId.includes("state-change") || senseId.includes("into-state") || senseId.includes("become")) {
    return "state";
  }
  if (senseId.includes("grasp") || senseId.includes("carry")) return "grasp";
  if (senseId.includes("create") || senseId.includes("cause")) return "make";
  if (senseId.includes("keep")) return "keep";
  if (senseId.includes("vertical") || senseId.includes("completion")) return "up";
  if (senseId.includes("exit") || senseId.includes("away")) return "out";
  if (senseId.includes("reveal") || senseId.includes("emerge")) return "reveal";
  if (senseId.includes("compose")) return "compose";
  if (senseId.includes("opaque")) return "opaque";
  return "domain";
}

export function SenseVisual({ senseId, item }: SenseVisualProps) {
  const kind = visualKind(senseId);

  return (
    <figure className={`sense-visual sense-visual-${kind}`} aria-label={`${senseId} 감각 그림`}>
      <svg viewBox="0 0 320 188" role="img">
        <defs>
          <marker id={`arrow-${senseId}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0,0 L8,4 L0,8 Z" />
          </marker>
        </defs>

        {kind === "domain" ? (
          <>
            <ellipse className="visual-domain" cx="160" cy="96" rx="92" ry="58" />
            <circle className="visual-chip" cx="160" cy="96" r="18" />
            <text x="160" y="172" textAnchor="middle">영역 안에 자리함</text>
          </>
        ) : null}

        {kind === "arrival" ? (
          <>
            <ellipse className="visual-domain" cx="204" cy="96" rx="74" ry="54" />
            <path className="visual-arrow" d="M54 96 C92 66, 126 66, 168 90" markerEnd={`url(#arrow-${senseId})`} />
            <circle className="visual-chip muted" cx="58" cy="96" r="14" />
            <circle className="visual-chip" cx="178" cy="94" r="17" />
            <text x="160" y="172" textAnchor="middle">밖에서 안으로 들어와 닿음</text>
          </>
        ) : null}

        {kind === "state" ? (
          <>
            <rect className="visual-zone" x="42" y="58" width="86" height="76" rx="16" />
            <rect className="visual-zone target" x="192" y="58" width="86" height="76" rx="16" />
            <path className="visual-arrow" d="M128 96 C150 72, 170 72, 192 96" markerEnd={`url(#arrow-${senseId})`} />
            <circle className="visual-chip" cx="202" cy="96" r="16" />
            <text x="85" y="148" textAnchor="middle">이전 상태</text>
            <text x="235" y="148" textAnchor="middle">도착 상태</text>
          </>
        ) : null}

        {kind === "grasp" ? (
          <>
            <ellipse className="visual-domain" cx="100" cy="96" rx="58" ry="46" />
            <path className="visual-hand" d="M105 96 C145 68, 174 68, 214 91" markerEnd={`url(#arrow-${senseId})`} />
            <circle className="visual-chip" cx="222" cy="92" r="16" />
            <text x="160" y="172" textAnchor="middle">손을 뻗어 잡아 끌어옴</text>
          </>
        ) : null}

        {kind === "make" ? (
          <>
            <ellipse className="visual-domain" cx="160" cy="96" rx="92" ry="58" />
            <circle className="visual-dot" cx="134" cy="98" r="6" />
            <circle className="visual-dot mid" cx="160" cy="96" r="14" />
            <circle className="visual-chip" cx="196" cy="92" r="24" />
            <text x="160" y="172" textAnchor="middle">없던 모양을 빚어냄</text>
          </>
        ) : null}

        {kind === "keep" ? (
          <>
            <ellipse className="visual-domain" cx="150" cy="96" rx="86" ry="54" />
            <path className="visual-tendency" d="M158 96 C202 82, 230 82, 266 96" />
            <path className="visual-hand" d="M214 54 L184 94 L218 134" />
            <circle className="visual-chip" cx="162" cy="96" r="17" />
            <text x="160" y="172" textAnchor="middle">흘러나가려는 것을 붙듦</text>
          </>
        ) : null}

        {kind === "up" ? (
          <>
            <rect className="visual-tube" x="132" y="40" width="56" height="104" rx="18" />
            <path className="visual-arrow" d="M160 132 L160 62" markerEnd={`url(#arrow-${senseId})`} />
            <circle className="visual-chip" cx="160" cy="74" r="16" />
            <text x="160" y="172" textAnchor="middle">위로 / 끝까지 차오름</text>
          </>
        ) : null}

        {kind === "out" ? (
          <>
            <rect className="visual-container" x="72" y="54" width="126" height="84" rx="18" />
            <path className="visual-arrow" d="M126 96 C166 86, 198 86, 248 96" markerEnd={`url(#arrow-${senseId})`} />
            <circle className="visual-chip" cx="244" cy="96" r="16" />
            <text x="160" y="172" textAnchor="middle">안에서 밖으로 빠져나감</text>
          </>
        ) : null}

        {kind === "reveal" ? (
          <>
            <rect className="visual-cover" x="74" y="58" width="130" height="78" rx="16" />
            <path className="visual-arrow" d="M204 96 C224 78, 238 72, 258 68" markerEnd={`url(#arrow-${senseId})`} />
            <circle className="visual-chip" cx="226" cy="84" r="16" />
            <text x="160" y="172" textAnchor="middle">가려진 것이 드러남</text>
          </>
        ) : null}

        {kind === "compose" ? (
          <>
            <circle className="visual-mini" cx="76" cy="86" r="28" />
            <text x="76" y="91" textAnchor="middle">V</text>
            <path className="visual-arrow small" d="M126 122 L126 62" markerEnd={`url(#arrow-${senseId})`} />
            <text x="160" y="92" textAnchor="middle">=</text>
            <ellipse className="visual-domain" cx="230" cy="92" rx="48" ry="34" />
            <circle className="visual-chip" cx="230" cy="82" r="14" />
            <text x="160" y="172" textAnchor="middle">동사 그림 + up 그림</text>
          </>
        ) : null}

        {kind === "opaque" ? (
          <>
            <rect className="visual-lock" x="116" y="80" width="88" height="58" rx="14" />
            <path className="visual-lock-loop" d="M136 80 C136 42, 184 42, 184 80" />
            <text x="160" y="172" textAnchor="middle">합으로 안 풀리면 통째로</text>
          </>
        ) : null}
      </svg>
      <figcaption>{item ? `${item} · ` : ""}{senseId}</figcaption>
    </figure>
  );
}
