/**
 * Markdown AST 헬퍼 — remark 기반.
 *
 * Phase 2의 regex 파싱은 fragile하다(`####`, `Verdict:`, `|` 코드블록 안 매칭 등).
 * 이 모듈은 unified + remark-parse + remark-frontmatter + remark-gfm으로
 * 정확한 AST를 만들고, validator가 기대하는 shape으로 정규화한다.
 */

import YAML from "yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { toString as mdastToString } from "mdast-util-to-string";

const processor = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]).use(remarkGfm);

export function parseMarkdown(markdown) {
  return processor.parse(markdown);
}

export function getFrontmatter(ast) {
  const node = ast.children.find((child) => child.type === "yaml");
  if (!node) return {};
  try {
    return YAML.parse(node.value ?? "") ?? {};
  } catch {
    return {};
  }
}

export function nodeToString(node) {
  return mdastToString(node).trim();
}

function isHeading(node, depth) {
  return node.type === "heading" && (depth === undefined || node.depth === depth);
}

export function getSection(ast, depth, headingText) {
  const target = headingText.trim().toLowerCase();
  const children = ast.children;
  let startIndex = -1;

  for (let i = 0; i < children.length; i += 1) {
    if (!isHeading(children[i], depth)) continue;
    if (nodeToString(children[i]).toLowerCase() !== target) continue;
    startIndex = i;
    break;
  }
  if (startIndex === -1) return [];

  const result = [];
  for (let i = startIndex + 1; i < children.length; i += 1) {
    if (children[i].type === "heading" && children[i].depth <= depth) break;
    result.push(children[i]);
  }
  return result;
}

export function hasSection(ast, depth, headingText) {
  const target = headingText.trim().toLowerCase();
  return ast.children.some(
    (child) => isHeading(child, depth) && nodeToString(child).toLowerCase() === target,
  );
}

export function getSubsections(nodes, depth) {
  const subsections = [];
  let current = null;
  for (const node of nodes) {
    if (isHeading(node, depth)) {
      if (current) subsections.push(current);
      current = { heading: nodeToString(node), nodes: [] };
      continue;
    }
    if (current) current.nodes.push(node);
  }
  if (current) subsections.push(current);
  return subsections;
}

export function getTableRows(nodes) {
  const tables = nodes.filter((node) => node.type === "table" && node.children.length >= 2);
  return tables.flatMap((tableNode) => tableNodeToRecords(tableNode));
}

function tableNodeToRecords(tableNode) {
  if (!tableNode || tableNode.type !== "table" || tableNode.children.length < 2) return [];
  const headers = tableNode.children[0].children.map((cell) =>
    nodeToString(cell).toLowerCase().trim(),
  );
  return tableNode.children.slice(1).flatMap((row) => {
    const cells = row.children.map((cell) => nodeToString(cell).trim());
    if (cells.every((cell) => cell === "")) return [];
    const record = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return [record];
  });
}

/**
 * blockquote 안에서 정확히 한 줄이 `check:evidence-coverage` 마커인 paragraph
 * 라인 수를 센다. remark는 연속된 blockquote 라인을 한 paragraph로 합치므로,
 * paragraph 텍스트를 줄 단위로 split해 정확 일치 라인을 카운트해야 한다.
 *
 * 같은 blockquote 안에 마커가 2번 들어 있어도, 산문 사이에 substring으로 등장한
 * 경우에도 false positive 없이 마커 _라인_만 잡는다.
 */
function countMarkerLinesInBlockquote(blockquote) {
  let count = 0;
  for (const child of blockquote.children ?? []) {
    if (child.type !== "paragraph") continue;
    const text = nodeToString(child);
    for (const line of text.split(/\r?\n/)) {
      if (line.trim().toLowerCase() === "check:evidence-coverage") count += 1;
    }
  }
  return count;
}

/**
 * `check:evidence-coverage` 마커 라인을 가진 blockquote들을 찾는다.
 * remark-gfm은 blockquote 내부에서도 GFM 표를 인식한다 — blockquote의 children에서
 * 표 노드를 직접 추출한다.
 *
 * 반환: 매칭된 blockquote마다 `{ blockquote, markerLines, tableNode, rows }`.
 *   - markerLines: 이 blockquote 안의 정확 일치 마커 라인 수
 *   - tableNode: blockquote 안의 첫 table 노드 (없으면 null)
 *   - rows: tableNode가 있을 때만 record 배열, 없으면 null
 *
 * 호출자는 모든 match의 `markerLines` 합으로 전체 마커 수를 계산한다.
 */
export function findCheckEvidenceCoverageBlockquotes(nodes) {
  const matches = [];
  for (const node of nodes) {
    if (node.type !== "blockquote") continue;
    const markerLines = countMarkerLinesInBlockquote(node);
    if (markerLines === 0) continue;
    const tableNode = node.children.find((child) => child.type === "table") ?? null;
    matches.push({
      blockquote: node,
      markerLines,
      tableNode,
      rows: tableNode ? tableNodeToRecords(tableNode) : null,
    });
  }
  return matches;
}

/**
 * 단일 `check:evidence-coverage` 마커 blockquote의 table rows를 반환한다.
 * 호출자가 multi-marker / missing-table 같은 구조 오류를 처리하지 않을 때 쓰는 편의.
 *
 * 반환:
 *   - null: 전체 마커 라인이 정확히 1이 아니거나, 그 blockquote에 table이 없을 때
 *   - [record, ...]: 정확히 1개의 마커 라인 + table이 있을 때만 row 배열
 */
export function getCheckEvidenceCoverageRows(nodes) {
  const matches = findCheckEvidenceCoverageBlockquotes(nodes);
  const totalMarkerLines = matches.reduce((sum, m) => sum + m.markerLines, 0);
  if (totalMarkerLines !== 1) return null;
  const match = matches.find((m) => m.markerLines === 1);
  if (!match || !match.tableNode) return null;
  return match.rows ?? [];
}

/**
 * 노드의 텍스트를 모으되 inline code(`...`)는 제외한다.
 * `\`Verdict: met\`` 같은 인용 텍스트가 verdict로 잘못 잡히지 않도록.
 */
export function nodeTextWithoutInlineCode(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "inlineCode") return "";
  if (node.type === "code") return "";
  if (node.type === "text") return node.value ?? "";
  if (Array.isArray(node.children)) {
    return node.children.map(nodeTextWithoutInlineCode).join("");
  }
  return "";
}

/**
 * paragraph와 list item을 노드 단위로 순회하면서 첫 매칭 key-value를 뽑는다.
 * 두 paragraph가 합쳐져 false 매칭(`metEvidence`)을 만들지 않도록 노드 경계를 지킨다.
 * inline code는 제외해 인용 텍스트가 매칭되지 않도록 한다.
 */
export function extractKeyValues(nodes, keys) {
  const result = {};
  const visit = (node) => {
    const text = nodeTextWithoutInlineCode(node);
    for (const key of keys) {
      if (result[key] !== undefined) continue;
      const pattern = new RegExp(`^\\s*-?\\s*${key}\\s*:\\s*(.+?)\\s*$`, "im");
      const match = text.match(pattern);
      if (match) result[key] = match[1].trim();
    }
  };
  for (const node of nodes) {
    if (node.type === "paragraph") {
      visit(node);
    } else if (node.type === "list") {
      for (const item of node.children) visit(item);
    }
  }
  return result;
}

/**
 * run:shell code blocks를 추출한다. lang은 "run:shell" 또는 "run" + meta="shell" 둘 다 허용.
 * 가장 가까운 상위 ### 헤딩을 함께 기록한다.
 */
export function getRunShellBlocks(nodes) {
  const blocks = [];
  let currentHeading = "run";
  for (const node of nodes) {
    if (node.type === "heading" && node.depth === 3) {
      currentHeading = nodeToString(node);
      continue;
    }
    if (node.type !== "code") continue;
    const lang = node.lang ?? "";
    const meta = node.meta ?? "";
    const isRunShell = lang === "run:shell" || (lang === "run" && meta === "shell");
    if (!isRunShell) continue;
    const command = (node.value ?? "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line !== "" && !line.startsWith("#"))
      ?.replace(/^\$\s*/, "");
    if (command) blocks.push({ heading: currentHeading, command });
  }
  return blocks;
}

/**
 * 한 노드 그룹에서 인라인 코드(`promise:foo` 등) 모두 모아준다.
 * Sufficiency Review 같은 산문 안의 `evidence: ...` 검출용.
 */
export function collectInlineCode(nodes) {
  const out = [];
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "inlineCode" && typeof node.value === "string") {
      out.push(node.value);
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  }
  nodes.forEach(walk);
  return out;
}

/**
 * 한 섹션의 list item을 [`- Verdict: met`, `- Evidence: ...`] 형태로 평평하게 추출.
 */
export function getListItemTexts(nodes) {
  const texts = [];
  for (const node of nodes) {
    if (node.type !== "list") continue;
    for (const item of node.children) {
      texts.push(nodeToString(item).trim());
    }
  }
  return texts;
}
