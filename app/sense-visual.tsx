import type { TrainingItem } from "@/src/content/content-types";

// @aspect aspect:design-baseline-preservation

type VisualItem = Pick<TrainingItem, "sense_id" | "subject_label" | "object_label" | "type"> & {
  verb_label?: string;
};

type SenseVisualProps = {
  item: VisualItem;
};

const ITEM_COLOR: Record<string, string> = {
  have: "#8a5a8f",
  get: "#2f6db0",
  take: "#b07b2f",
  make: "#9c4f6e",
  keep: "#15786b",
  be: "#5f6b3a",
  go: "#a8523a",
  come: "#357a73",
  up: "#3a6b5c",
  out: "#3b7b86",
  "phrasal-up": "#5a59a8",
};

const SENSE_LABEL: Record<string, string> = {
  "have-domain-location": "대상이 영역 안에",
  "have-event-in-domain": "사건이 영역 안에",
  "get-arrival": "밖에서 안으로 도달",
  "get-state-change": "상태로 옮겨 감",
  "get-into-state": "결과 상태로 진입(get+과거분사)",
  "take-grasp": "손 뻗어 점유",
  "take-carry": "잡아 데려감",
  "make-create": "새로 빚어냄",
  "make-cause": "상태를 빚어냄",
  "keep-hold": "흘러나가려는 것을 붙듦",
  "keep-state": "상태를 붙들어 이어 감",
  "be-exist-locate": "그냥 그 자리에 있음",
  "be-state": "그 상태에 머묾",
  "go-away": "여기서 바깥으로 멀어짐",
  "go-become": "(흔히 나쁜) 상태로 가 버림",
  "come-toward": "여기로 다가옴",
  "come-emerge": "숨었던 것이 드러나 나타남",
  "up-vertical": "아래에서 위로",
  "up-completion": "끝까지 차오름",
  "out-exit": "안에서 밖으로",
  "out-reveal": "가려진 것이 드러남",
  "compose-vertical": "합성 — 위로",
  "compose-completion": "합성 — 끝까지",
  "opaque-idiom": "관용 — 통째로",
};

function esc(value: string) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char;
  });
}

function fitText(value: string, maxWidth: number, baseSize: number) {
  let text = String(value || "");
  let size = baseSize;
  const approx = () => text.length * size * 0.56;
  while (size > 8 && approx() > maxWidth) size -= 1;
  if (approx() > maxWidth) {
    const maxChars = Math.max(4, Math.floor(maxWidth / (size * 0.56)) - 1);
    text = `${text.slice(0, maxChars)}…`;
  }
  return { text, size };
}

function itemColor(key: string) {
  return ITEM_COLOR[key] || "#574f47";
}

function senseLabel(id: string) {
  return SENSE_LABEL[id] || id;
}

function itemOfSense(id: string) {
  if (id === "opaque-idiom" || id.startsWith("compose-")) return "phrasal-up";
  return id.split("-")[0] || "have";
}

function chip(x: number, y: number, w: number, h: number, col: string, label: string) {
  const fitted = fitText(label, w - 12, 12);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="#ffffff" stroke="${col}" stroke-width="2"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="${fitted.size}" fill="#232020" font-weight="600">${esc(fitted.text)}</text>`;
}

function svgHave(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("have");
  const cls = settle ? "viz-settle settle" : "viz-settle";
  const startStyle = settle ? "" : ' style="transform: translateY(-46px); opacity:0.35;"';
  const vb = compact ? "0 0 200 160" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const cy = compact ? 86 : 104;
  const rx = compact ? 74 : 96;
  const ry = compact ? 54 : 64;
  return `<svg viewBox="${vb}" role="img" aria-label="대상 칩이 영역 원 안에 정적으로 자리한 그림">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f3edf4" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy - ry + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, rx * 1.5, 11).text)} 영역</text>` +
    `<g class="${cls}"${startStyle}>${chip(cx - 52, cy - 16, 104, 36, col, objectLabel)}</g>` +
    `<text x="${cx}" y="${cy + ry - 4}" text-anchor="middle" font-size="10" fill="#a89aa9">힘 없이 그냥 놓임</text>` +
    "</svg>";
}

function svgKeep(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("keep");
  const claspCls = settle ? "viz-clasp settle" : "viz-clasp";
  const handCls = settle ? "viz-hand settle" : "viz-hand";
  const chipStart = settle ? "" : ' style="transform: translateX(40px); opacity:0.55;"';
  const handStart = settle ? "" : ' style="transform: translateY(-26px) rotate(-14deg); opacity:0.4;"';
  const vb = compact ? "0 0 200 160" : "0 0 320 200";
  const cx = compact ? 96 : 150;
  const cy = compact ? 90 : 110;
  const rx = compact ? 70 : 94;
  const ry = compact ? 54 : 64;
  const edgeX = cx + rx;
  const outX = compact ? 188 : 300;
  return `<svg viewBox="${vb}" role="img" aria-label="영역 안 대상이 밖으로 흘러나가려는데 손이 눌러 붙드는 그림">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e3f2ef" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy - ry + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, rx * 1.5, 11).text)} 영역</text>` +
    `<line x1="${edgeX - 14}" y1="${cy - 22}" x2="${outX - 6}" y2="${cy - 22}" stroke="#bf6b5a" stroke-width="2" stroke-dasharray="4 4" opacity="0.85"/>` +
    `<path d="M${outX} ${cy - 22} L${outX - 12} ${cy - 28} L${outX - 12} ${cy - 16} Z" fill="#bf6b5a" opacity="0.85"/>` +
    `<text x="${outX - 2}" y="${cy - 32}" font-size="9.5" fill="#bf6b5a" text-anchor="end">나가려는 흐름</text>` +
    `<g class="${claspCls}"${chipStart}>${chip(cx - 44, cy - 12, 96, 36, col, objectLabel)}</g>` +
    `<g class="${handCls}"${handStart}>` +
    `<path d="M${cx - 30} ${cy - 24} q30 -22 64 0" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>` +
    `<line x1="${cx - 12}" y1="${cy - 28}" x2="${cx - 12}" y2="${cy - 14}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>` +
    `<line x1="${cx + 14}" y1="${cy - 28}" x2="${cx + 14}" y2="${cy - 14}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>` +
    "</g>" +
    `<text x="${cx}" y="${cy + ry - 4}" text-anchor="middle" font-size="10" fill="${col}">손이 눌러 붙듦 (대항력)</text>` +
    "</svg>";
}

function svgGet(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("get");
  const cls = settle ? "viz-slide settle" : "viz-slide";
  const startStyle = settle ? "" : ' style="transform: translateX(-104px); opacity:0.4;"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 118 : 188;
  const cy = compact ? 80 : 104;
  const rx = compact ? 60 : 86;
  const ry = compact ? 48 : 62;
  const ax = compact ? 8 : 18;
  const chipW = compact ? 150 : 160;
  return `<svg viewBox="${vb}" role="img" aria-label="대상이 영역 원 밖에서 화살표를 따라 안으로 들어와 닿는 그림">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#eef4fa" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy - ry + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, rx * 1.5, 11).text)} 영역</text>` +
    `<line x1="${ax}" y1="${cy}" x2="${cx - 6}" y2="${cy}" stroke="${col}" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M${cx} ${cy} L${cx - 16} ${cy - 8} L${cx - 16} ${cy + 8} Z" fill="${col}"/>` +
    `<text x="${ax + 6}" y="${cy - 12}" font-size="10" fill="#8d867d">밖</text>` +
    `<g class="${cls}"${startStyle}>${chip(cx - chipW / 2, cy - 16, chipW, 36, col, objectLabel)}</g>` +
    "</svg>";
}

function svgTake(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("take");
  const cls = settle ? "viz-slide settle" : "viz-slide";
  const startStyle = settle ? "" : ' style="transform: translateX(86px); opacity:0.4;"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 86 : 132;
  const cy = compact ? 80 : 104;
  const rx = compact ? 60 : 86;
  const ry = compact ? 48 : 62;
  const reach = compact ? 178 : 296;
  return `<svg viewBox="${vb}" role="img" aria-label="주어의 손이 영역 밖 대상을 붙잡아 원 안으로 끌어들이는 그림">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f6efe2" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy - ry + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, rx * 1.5, 11).text)} 영역</text>` +
    `<line x1="${cx + 4}" y1="${cy}" x2="${reach - 8}" y2="${cy}" stroke="${col}" stroke-width="3"/>` +
    `<path d="M${reach - 10} ${cy - 12} A 12 12 0 1 0 ${reach - 10} ${cy + 12}" fill="none" stroke="${col}" stroke-width="3"/>` +
    `<path d="M${cx + 30} ${cy} L${cx + 46} ${cy - 7} L${cx + 46} ${cy + 7} Z" fill="${col}"/>` +
    `<text x="${reach - 6}" y="${cy - 16}" font-size="10" fill="#8d867d" text-anchor="end">밖의 대상</text>` +
    `<g class="${cls}"${startStyle}>${chip(cx - 48, cy - 16, 96, 36, col, objectLabel)}</g>` +
    "</svg>";
}

function svgMake(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("make");
  const cls = settle ? "viz-grow settle" : "viz-grow";
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const cy = compact ? 80 : 104;
  const rx = compact ? 72 : 96;
  const ry = compact ? 50 : 64;
  const growStyle = settle
    ? ` style="transform-origin: ${cx}px ${cy}px;"`
    : ` style="transform: scale(0.12); opacity:0.2; transform-origin: ${cx}px ${cy}px;"`;
  return `<svg viewBox="${vb}" role="img" aria-label="영역 안에서 없던 형체가 새로 생겨나 커지는 그림">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f7edf1" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy - ry + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, rx * 1.5, 11).text)} 손끝</text>` +
    `<circle cx="${cx - 38}" cy="${cy - 30}" r="2.5" fill="${col}" opacity="0.6"/>` +
    `<circle cx="${cx + 40}" cy="${cy - 24}" r="2" fill="${col}" opacity="0.5"/>` +
    `<circle cx="${cx + 30}" cy="${cy + 30}" r="2.5" fill="${col}" opacity="0.6"/>` +
    `<g class="${cls}"${growStyle}>${chip(cx - 52, cy - 16, 104, 36, col, objectLabel)}` +
    `<text x="${cx}" y="${cy - 24}" text-anchor="middle" font-size="10" fill="${col}">새로 생겨남</text></g>` +
    "</svg>";
}

function svgUpVertical(_subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("up");
  const cls = settle ? "viz-rise settle" : "viz-rise";
  const startStyle = settle ? "" : ' style="transform: translateY(56px); opacity:0.3;"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const topY = compact ? 22 : 38;
  const botY = compact ? 128 : 170;
  const chipY = compact ? 50 : 56;
  return `<svg viewBox="${vb}" role="img" aria-label="대상이 세로 화살표를 따라 아래에서 위로 떠오르는 그림">` +
    `<line x1="${cx}" y1="${botY}" x2="${cx}" y2="${topY + 10}" stroke="${col}" stroke-width="3"/>` +
    `<path d="M${cx} ${topY} L${cx - 8} ${topY + 18} L${cx + 8} ${topY + 18} Z" fill="${col}"/>` +
    `<rect x="${cx - 60}" y="${botY + 2}" width="120" height="12" rx="4" fill="#ece7dd"/>` +
    `<g class="${cls}"${startStyle}>${chip(cx - 52, chipY, 104, 36, col, objectLabel)}</g>` +
    "</svg>";
}

function svgUpCompletion(_subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("up");
  const cls = settle ? "viz-fill settle" : "viz-fill";
  const rimCls = settle ? "viz-rim hit" : "viz-rim";
  const startStyle = settle ? "" : ' style="transform: translateY(60px);"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const rimY = compact ? 34 : 44;
  const botY = compact ? 128 : 176;
  const wLeft = cx - 52;
  const wWidth = 104;
  const fillTop = rimY;
  const fillH = botY - rimY;
  const clipId = `vc-${objectLabel.replace(/[^a-z0-9]/gi, "").slice(0, 8) || "up"}-${compact ? "c" : "n"}`;
  return `<svg viewBox="${vb}" role="img" aria-label="그릇이 바닥부터 차올라 가장자리 한계선에 닿는 그림">` +
    `<line x1="${cx - 64}" y1="${rimY}" x2="${cx + 64}" y2="${rimY}" stroke="${col}" stroke-width="2" stroke-dasharray="6 4" class="${rimCls}"/>` +
    `<path d="M${cx - 54} ${rimY - 4} L${cx - 54} ${botY + 2} L${cx + 54} ${botY + 2} L${cx + 54} ${rimY - 4}" fill="none" stroke="#bdb6a8" stroke-width="3"/>` +
    `<clipPath id="${clipId}"><rect x="${wLeft}" y="${fillTop}" width="${wWidth}" height="${fillH}"/></clipPath>` +
    `<g clip-path="url(#${clipId})"><g class="${cls}"${startStyle}><rect x="${wLeft}" y="${fillTop}" width="${wWidth}" height="${fillH}" fill="${col}" opacity="0.82"/></g></g>` +
    `<text x="${cx}" y="${fillTop + fillH / 2 + 4}" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">${esc(fitText(objectLabel, wWidth - 8, 12).text)}</text>` +
    "</svg>";
}

function svgOutExit(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("out");
  const cls = settle ? "viz-slide settle" : "viz-slide";
  const startStyle = settle ? "" : ' style="transform: translateX(-110px); opacity:0.5;"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 78 : 120;
  const cy = compact ? 80 : 104;
  const rx = compact ? 56 : 80;
  const ry = compact ? 48 : 62;
  const outX = compact ? 168 : 280;
  return `<svg viewBox="${vb}" role="img" aria-label="용기 안에 있던 칩이 경계를 넘어 바깥으로 나가는 그림">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e9f3f4" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy - ry + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, rx * 1.5, 11).text)} (안)</text>` +
    `<line x1="${cx + rx - 6}" y1="${cy}" x2="${outX - 6}" y2="${cy}" stroke="${col}" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M${outX} ${cy} L${outX - 16} ${cy - 8} L${outX - 16} ${cy + 8} Z" fill="${col}"/>` +
    `<text x="${outX - 2}" y="${cy - 12}" font-size="10" fill="#8d867d" text-anchor="end">밖</text>` +
    `<g class="${cls}"${startStyle}>${chip(cx + rx - 20, cy - 16, 92, 36, col, objectLabel)}</g>` +
    "</svg>";
}

function svgOutReveal(_subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("out");
  const cls = settle ? "viz-reveal settle" : "viz-reveal";
  const startStyle = settle ? "" : ' style="transform: translateY(14px); opacity:0.18;"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const cy = compact ? 86 : 116;
  const coverY = compact ? 40 : 52;
  const coverH = compact ? 46 : 60;
  const coverW = compact ? 150 : 230;
  return `<svg viewBox="${vb}" role="img" aria-label="가려져 있던 칩이 덮개 밖으로 나와 보이게 되는 그림">` +
    `<g class="${cls}"${startStyle}>${chip(cx - 52, cy - 18, 104, 36, col, objectLabel)}</g>` +
    `<rect x="${cx - coverW / 2}" y="${coverY}" width="${coverW}" height="${coverH}" rx="10" fill="#9fb6bb" opacity="0.5"/>` +
    `<text x="${cx}" y="${coverY + 18}" text-anchor="middle" font-size="10" fill="#3b5a60">가려져 안 보이던 것</text>` +
    `<text x="${cx}" y="${cy + 34}" text-anchor="middle" font-size="10" fill="${col}">밖으로 드러나 보임</text>` +
    "</svg>";
}

function svgBeExist(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("be");
  const cls = settle ? "viz-settle settle" : "viz-settle";
  const startStyle = settle ? "" : ' style="transform: translateY(-40px); opacity:0.35;"';
  const vb = compact ? "0 0 200 160" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const cy = compact ? 92 : 116;
  const baseW = compact ? 150 : 220;
  return `<svg viewBox="${vb}" role="img" aria-label="영역 원 없이 그냥 그 자리에 존재·위치한 칩 그림">` +
    `<text x="${cx}" y="${cy - (compact ? 50 : 64)}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(subjectLabel, baseW, 11).text)}</text>` +
    `<line x1="${cx - baseW / 2}" y1="${cy + 24}" x2="${cx + baseW / 2}" y2="${cy + 24}" stroke="#c9cbb5" stroke-width="2" stroke-dasharray="2 5"/>` +
    `<circle cx="${cx}" cy="${cy + 24}" r="3.2" fill="${col}"/>` +
    `<g class="${cls}"${startStyle}>${chip(cx - 52, cy - 14, 104, 36, col, objectLabel)}</g>` +
    `<text x="${cx}" y="${cy + 42}" text-anchor="middle" font-size="10" fill="#9ca085">영역에 속한 게 아니라 그냥 있음</text>` +
    "</svg>";
}

function svgBeState(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("be");
  const cls = settle ? "viz-settle settle" : "viz-settle";
  const startStyle = settle ? "" : ' style="opacity:0.4;"';
  const vb = compact ? "0 0 200 160" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const cy = compact ? 88 : 112;
  const boxW = compact ? 150 : 210;
  const boxH = compact ? 70 : 86;
  const bx = cx - boxW / 2;
  const by = cy - boxH / 2;
  return `<svg viewBox="${vb}" role="img" aria-label="상태 박스 안에 주어가 정적으로 머무는 그림">` +
    `<rect x="${bx}" y="${by}" width="${boxW}" height="${boxH}" rx="12" fill="#eef0e3" stroke="${col}" stroke-width="2"/>` +
    `<text x="${cx}" y="${by + 16}" text-anchor="middle" font-size="11" fill="${col}">${esc(fitText(objectLabel, boxW - 16, 11).text)} 상태</text>` +
    `<g class="${cls}"${startStyle}>${chip(cx - 50, cy - 8, 100, 34, col, subjectLabel)}</g>` +
    `<text x="${cx}" y="${by + boxH - 8}" text-anchor="middle" font-size="10" fill="#9ca085">옮겨 온 게 아니라 그 상태에 머묾 (= 등호)</text>` +
    "</svg>";
}

function svgGoAway(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("go");
  const cls = settle ? "viz-slide settle" : "viz-slide";
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const hereX = compact ? 36 : 56;
  const cy = compact ? 82 : 104;
  const outX = compact ? 178 : 296;
  const startStyle = settle ? "" : ` style="transform: translateX(-${compact ? 90 : 150}px); opacity:0.4;"`;
  const chipW = compact ? 96 : 110;
  return `<svg viewBox="${vb}" role="img" aria-label="기준점에서 주어가 바깥으로 멀어져 가는 그림">` +
    `<circle cx="${hereX}" cy="${cy}" r="7" fill="none" stroke="#8d867d" stroke-width="2"/>` +
    `<circle cx="${hereX}" cy="${cy}" r="2.5" fill="#8d867d"/>` +
    `<text x="${hereX}" y="${cy - 14}" text-anchor="middle" font-size="10" fill="#8d867d">여기(기준점)</text>` +
    `<line x1="${hereX + 12}" y1="${cy}" x2="${outX - 6}" y2="${cy}" stroke="${col}" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M${outX} ${cy} L${outX - 16} ${cy - 8} L${outX - 16} ${cy + 8} Z" fill="${col}"/>` +
    `<text x="${outX - 2}" y="${cy - 14}" text-anchor="end" font-size="10" fill="${col}">멀어져 감</text>` +
    `<g class="${cls}"${startStyle}>${chip(outX - chipW - 6, cy - 16, chipW, 34, col, subjectLabel)}</g>` +
    `<text x="${(hereX + outX) / 2}" y="${cy + 40}" text-anchor="middle" font-size="10" fill="#9c8d86">${esc(fitText(objectLabel, compact ? 150 : 220, 10).text)}</text>` +
    "</svg>";
}

function svgGoBecome(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("go");
  const cls = settle ? "viz-slide settle" : "viz-slide";
  const vb = compact ? "0 0 200 160" : "0 0 320 200";
  const cy = compact ? 88 : 112;
  const normX = compact ? 40 : 60;
  const badX = compact ? 158 : 256;
  const startStyle = settle ? "" : ` style="transform: translateX(-${compact ? 80 : 140}px); opacity:0.4;"`;
  return `<svg viewBox="${vb}" role="img" aria-label="정상 상태에서 떠나 다른 상태로 옮겨 가 버리는 그림">` +
    `<rect x="${normX - 22}" y="${cy - 20}" width="44" height="40" rx="8" fill="#eef0e3" stroke="#a9ad94" stroke-width="1.5" stroke-dasharray="3 3"/>` +
    `<text x="${normX}" y="${cy - 26}" text-anchor="middle" font-size="9.5" fill="#9ca085">정상</text>` +
    `<rect x="${badX - 28}" y="${cy - 24}" width="${compact ? 60 : 70}" height="48" rx="9" fill="#f4e6e0" stroke="${col}" stroke-width="2"/>` +
    `<text x="${badX + (compact ? 2 : 7)}" y="${cy - 30}" text-anchor="middle" font-size="9.5" fill="${col}">${esc(fitText(objectLabel, compact ? 56 : 66, 9.5).text)} 상태</text>` +
    `<line x1="${normX + 24}" y1="${cy}" x2="${badX - 34}" y2="${cy}" stroke="${col}" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M${badX - 28} ${cy} L${badX - 44} ${cy - 8} L${badX - 44} ${cy + 8} Z" fill="${col}"/>` +
    `<g class="${cls}"${startStyle}>${chip(badX - 24, cy - 12, compact ? 56 : 66, 30, col, subjectLabel)}</g>` +
    `<text x="${compact ? 100 : 160}" y="${cy + 40}" text-anchor="middle" font-size="10" fill="#9c8d86">정상에서 벗어나 (흔히 나쁜) 상태로 가 버림</text>` +
    "</svg>";
}

function svgComeToward(subjectLabel: string, objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("come");
  const cls = settle ? "viz-slide settle" : "viz-slide";
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const hereX = compact ? 164 : 264;
  const cy = compact ? 82 : 104;
  const outX = compact ? 26 : 40;
  const startStyle = settle ? "" : ` style="transform: translateX(${compact ? 90 : 150}px); opacity:0.4;"`;
  const chipW = compact ? 96 : 110;
  return `<svg viewBox="${vb}" role="img" aria-label="주어가 바깥에서 기준점 쪽으로 다가오는 그림">` +
    `<circle cx="${hereX}" cy="${cy}" r="7" fill="none" stroke="#8d867d" stroke-width="2"/>` +
    `<circle cx="${hereX}" cy="${cy}" r="2.5" fill="#8d867d"/>` +
    `<text x="${hereX}" y="${cy - 14}" text-anchor="middle" font-size="10" fill="#8d867d">여기(기준점)</text>` +
    `<line x1="${outX + 6}" y1="${cy}" x2="${hereX - 12}" y2="${cy}" stroke="${col}" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M${hereX - 8} ${cy} L${hereX - 24} ${cy - 8} L${hereX - 24} ${cy + 8} Z" fill="${col}"/>` +
    `<text x="${outX + 4}" y="${cy - 14}" text-anchor="start" font-size="10" fill="${col}">다가옴</text>` +
    `<g class="${cls}"${startStyle}>${chip(outX + 6, cy - 16, chipW, 34, col, subjectLabel)}</g>` +
    `<text x="${(outX + hereX) / 2}" y="${cy + 40}" text-anchor="middle" font-size="10" fill="#5f8a85">${esc(fitText(objectLabel, compact ? 150 : 220, 10).text)}</text>` +
    "</svg>";
}

function svgComeEmerge(subjectLabel: string, _objectLabel: string, settle: boolean, compact?: boolean) {
  const col = itemColor("come");
  const cls = settle ? "viz-reveal settle" : "viz-reveal";
  const startStyle = settle ? "" : ' style="transform: translateY(18px); opacity:0.16;"';
  const vb = compact ? "0 0 200 150" : "0 0 320 200";
  const cx = compact ? 100 : 160;
  const cy = compact ? 90 : 120;
  const coverY = compact ? 38 : 50;
  const coverH = compact ? 46 : 60;
  const coverW = compact ? 150 : 230;
  return `<svg viewBox="${vb}" role="img" aria-label="숨어 있던 것이 드러나는 쪽으로 솟아 나와 나타나는 그림">` +
    `<line x1="${cx}" y1="${cy + 28}" x2="${cx}" y2="${coverY + coverH + 6}" stroke="${col}" stroke-width="2.5"/>` +
    `<path d="M${cx} ${coverY + coverH - 2} L${cx - 7} ${coverY + coverH + 14} L${cx + 7} ${coverY + coverH + 14} Z" fill="${col}"/>` +
    `<g class="${cls}"${startStyle}>${chip(cx - 52, cy - 16, 104, 36, col, subjectLabel)}</g>` +
    `<rect x="${cx - coverW / 2}" y="${coverY}" width="${coverW}" height="${coverH}" rx="10" fill="#9fc1bc" opacity="0.45"/>` +
    `<text x="${cx}" y="${coverY + 18}" text-anchor="middle" font-size="10" fill="#316860">숨어 있거나 아직 없던 것</text>` +
    `<text x="${cx}" y="${cy + 36}" text-anchor="middle" font-size="10" fill="${col}">드러나는 쪽으로 솟아 나옴 (나타남)</text>` +
    "</svg>";
}

function svgForSense(senseId: string, subj: string, obj: string, settle: boolean, compact?: boolean) {
  switch (senseId) {
    case "have-domain-location":
    case "have-event-in-domain":
      return svgHave(subj, obj, settle, compact);
    case "keep-hold":
    case "keep-state":
      return svgKeep(subj, obj, settle, compact);
    case "get-arrival":
    case "get-state-change":
    case "get-into-state":
      return svgGet(subj, obj, settle, compact);
    case "take-grasp":
    case "take-carry":
      return svgTake(subj, obj, settle, compact);
    case "make-create":
    case "make-cause":
      return svgMake(subj, obj, settle, compact);
    case "be-exist-locate":
      return svgBeExist(subj, obj, settle, compact);
    case "be-state":
      return svgBeState(subj, obj, settle, compact);
    case "go-away":
      return svgGoAway(subj, obj, settle, compact);
    case "go-become":
      return svgGoBecome(subj, obj, settle, compact);
    case "come-toward":
      return svgComeToward(subj, obj, settle, compact);
    case "come-emerge":
      return svgComeEmerge(subj, obj, settle, compact);
    case "out-exit":
      return svgOutExit(subj, obj, settle, compact);
    case "out-reveal":
      return svgOutReveal(subj, obj, settle, compact);
    case "up-completion":
    case "compose-completion":
      return svgUpCompletion(subj, obj, settle, compact);
    case "up-vertical":
    case "compose-vertical":
      return svgUpVertical(subj, obj, settle, compact);
    default:
      return svgHave(subj, obj, settle, compact);
  }
}

function vizBox(senseId: string, subj: string, obj: string, settle: boolean, caption: string) {
  return `<div class="viz-wrap">${svgForSense(senseId, subj, obj, settle)}<div class="viz-caption">${caption}</div></div>`;
}

function keepContrastViz(item: VisualItem, startSettle: boolean) {
  const subj = item.subject_label;
  const obj = item.object_label;
  return `<div class="contrast-wrap"><div class="contrast-label">keep ↔ have — 붙드는 힘이 있나, 그냥 있나</div>` +
    `<div class="contrast-row"><div class="contrast-cell keep"><div class="contrast-mini">${svgKeep(subj, obj, startSettle, true)}</div>` +
    `<div class="contrast-cap"><b>keep</b> — 나가려는 걸 손이 눌러 붙듦</div></div>` +
    `<div class="contrast-cell have"><div class="contrast-mini">${svgHave(subj, obj, true, true)}</div>` +
    `<div class="contrast-cap"><b>have</b> — 누르는 손 없이 그냥 놓임</div></div></div>` +
    `<div class="contrast-note">대항력(붙드는 손)이 느껴지면 keep, 그냥 있으면 have예요.</div></div>`;
}

function getIntoStateContrastViz(item: VisualItem, startSettle: boolean) {
  const subj = item.subject_label;
  const obj = item.object_label;
  return `<div class="contrast-wrap into"><div class="contrast-label">get + 과거분사 ↔ be — 진입 사건인가, 상태에 머묾인가</div>` +
    `<div class="contrast-row"><div class="contrast-cell into"><div class="contrast-mini">${svgGet(subj, obj, startSettle, true)}</div>` +
    `<div class="contrast-cap"><b>get + pp</b> — 결과 상태로 스스로 들어가 닿음</div></div>` +
    `<div class="contrast-cell have"><div class="contrast-mini">${svgHave(subj, obj, true, true)}</div>` +
    `<div class="contrast-cap"><b>be + pp</b> — 그 상태에 그냥 머물러 있음</div></div></div>` +
    `<div class="contrast-note">get married는 결혼한 상태로 <b>막 진입</b>(스스로 그 상태가 됨), be married는 부부인 <b>상태에 머묾</b>이에요.</div></div>`;
}

function combinedSvg(item: VisualItem, isVertical: boolean) {
  if (isVertical) {
    return `<svg viewBox="0 0 220 170" role="img" aria-label="동작이 진행되며 동시에 위로 향하는 합성 그림">` +
      '<rect x="10" y="120" width="200" height="12" rx="4" fill="#ece7dd"/>' +
      '<line x1="24" y1="126" x2="120" y2="126" stroke="#574f47" stroke-width="3"/>' +
      `<path d="M120 126 Q120 80 120 44" stroke="${itemColor("up")}" stroke-width="3" fill="none"/>` +
      `<path d="M120 30 L112 50 L128 50 Z" fill="${itemColor("up")}"/>` +
      `<rect x="68" y="44" width="104" height="34" rx="9" fill="#ffffff" stroke="${itemColor("up")}" stroke-width="2"/>` +
      `<text x="120" y="66" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">${esc(fitText(item.object_label, 96, 12).text)}</text>` +
      '<text x="60" y="150" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 위로가 한 장면에</text></svg>';
  }
  return `<svg viewBox="0 0 220 170" role="img" aria-label="동작이 끝점까지 차올라 완료되는 합성 그림">` +
    `<line x1="44" y1="34" x2="176" y2="34" stroke="${itemColor("up")}" stroke-width="2" stroke-dasharray="6 4"/>` +
    `<text x="180" y="38" font-size="9" fill="${itemColor("up")}">끝</text>` +
    '<path d="M56 30 L56 140 L164 140 L164 30" fill="none" stroke="#bdb6a8" stroke-width="3"/>' +
    `<rect x="58" y="34" width="104" height="104" fill="${itemColor("up")}" opacity="0.82"/>` +
    `<text x="110" y="92" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">${esc(fitText(item.object_label, 96, 12).text)}</text>` +
    '<text x="110" y="158" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 끝까지가 한 장면에</text></svg>';
}

function compositionViz(item: VisualItem) {
  const senseId = item.sense_id;
  const isVertical = senseId === "compose-vertical";
  const verbWord = item.verb_label || "(동사)";
  const verbMini = '<svg viewBox="0 0 140 120" role="img" aria-label="동사의 동작 그림">' +
    '<rect x="22" y="48" width="96" height="34" rx="9" fill="#ffffff" stroke="#574f47" stroke-width="2"/>' +
    `<text x="70" y="70" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">${esc(fitText(verbWord, 88, 12).text)}</text>` +
    '<path d="M40 96 H100" stroke="#8d867d" stroke-width="2.5"/><path d="M100 96 L92 91 L92 101 Z" fill="#8d867d"/>' +
    '<text x="70" y="30" text-anchor="middle" font-size="10" fill="#8d867d">동사의 동작</text></svg>';
  const upMini = isVertical ? svgUpVertical("바닥", "up", true, true) : svgUpCompletion("내용", "up", true, true);
  const capWord = isVertical ? "위로" : "끝까지";
  return `<div class="compose-wrap"><div class="compose-label">구동사 = 그림 두 개의 합</div>` +
    `<div class="compose-row"><div class="compose-cell"><div class="compose-mini">${verbMini}</div><div class="compose-cap">${esc(verbWord)} (동작)</div></div>` +
    `<div class="compose-plus">+</div><div class="compose-cell"><div class="compose-mini">${upMini}</div><div class="compose-cap">up (${capWord})</div></div><div class="compose-eq">=</div></div>` +
    `<div class="compose-result"><div class="compose-mini big">${combinedSvg(item, isVertical)}</div><div class="compose-cap result-cap"><b>${esc(verbWord)} up</b> — ${esc(item.subject_label)} / ${esc(item.object_label)}</div></div>` +
    '<div class="compose-note">이미 아는 두 그림의 결합, 통암기 아님</div></div>';
}

function idiomViz(item: VisualItem) {
  const verbWord = item.verb_label || "(동사)";
  const lock = '<svg viewBox="0 0 200 170" role="img" aria-label="두 그림을 합쳐도 뜻이 안 나오는 자물쇠 그림">' +
    '<rect x="62" y="74" width="76" height="62" rx="10" fill="#efe7d8" stroke="#7a6f5c" stroke-width="3"/>' +
    '<path d="M76 74 V58 a24 24 0 0 1 48 0 V74" fill="none" stroke="#7a6f5c" stroke-width="6"/>' +
    '<circle cx="100" cy="100" r="8" fill="#7a6f5c"/><rect x="96" y="100" width="8" height="18" fill="#7a6f5c"/>' +
    `<text x="100" y="32" text-anchor="middle" font-size="13" fill="#7a6f5c" font-weight="700">${esc(verbWord)} + up = ?</text>` +
    '<text x="100" y="156" text-anchor="middle" font-size="10" fill="#8d867d">합쳐도 뜻이 안 나온다</text></svg>';
  return `<div class="idiom-wrap"><div class="idiom-label">이건 합으로 안 풀린다</div><div class="idiom-mini">${lock}</div>` +
    `<div class="idiom-note"><b>${esc(verbWord)} up</b>은 두 그림(동사 + up)을 합쳐도 뜻이 안 나오는 <b>굳은 관용 표현</b>이에요. 통째로 익히는 게 정직합니다.</div>` +
    '<div class="idiom-warn">모든 구동사가 두 그림의 합은 아니에요. 합으로 풀리는 것(drink up, pack up)과 통째로 외울 것(make up, bring up, look up)을 구분하는 눈이 진짜 실력이에요.</div></div>';
}

function isOpaque(senseId: string) {
  return senseId === "opaque-idiom";
}

function isCompose(senseId: string) {
  return senseId === "compose-vertical" || senseId === "compose-completion";
}

function isKeep(senseId: string) {
  return senseId === "keep-hold" || senseId === "keep-state";
}

function renderExistingVisual(item: VisualItem) {
  const startSettle = true;
  const subj = item.subject_label;
  const obj = item.object_label;
  const senseId = item.sense_id;
  const type = item.type || "sense-choice";

  if (isOpaque(senseId)) return idiomViz(item);
  if (isCompose(senseId)) {
    const base =
      type === "sense-cloze"
        ? vizBox(
            senseId,
            subj,
            obj,
            startSettle,
            `이 불변화사가 그리는 그림 — ${senseId === "compose-completion" ? "끝까지 차올라 완료" : "아래에서 위로"}`,
          )
        : "";
    return base + compositionViz(item);
  }
  if (isKeep(senseId)) {
    return vizBox(senseId, subj, obj, startSettle, `이 그림 — ${senseLabel(senseId)}`) + keepContrastViz(item, startSettle);
  }
  if (senseId === "get-into-state") {
    return vizBox(senseId, subj, obj, startSettle, `이 그림 — ${senseLabel(senseId)}`) + getIntoStateContrastViz(item, startSettle);
  }
  if (type === "verb-choice") {
    return vizBox(senseId, subj, obj, startSettle, `이 동사가 그리는 그림 — ${senseLabel(senseId)}`);
  }
  if (type === "sense-cloze") {
    return vizBox(senseId, subj, obj, startSettle, `이 불변화사가 그리는 그림 — ${senseLabel(senseId)}`);
  }
  return vizBox(senseId, subj, obj, startSettle, `이 그림 — ${senseLabel(senseId) || itemOfSense(senseId)}`);
}

export function SenseVisual({ item }: SenseVisualProps) {
  return <div dangerouslySetInnerHTML={{ __html: renderExistingVisual(item) }} />;
}
