#!/usr/bin/env node

/**
 * mc:propagate — Promise의 acceptance check를 feature-specs.md ledger와
 * covering Evidence Ledger의 `> check:evidence-coverage` blockquote 표로 전파한다.
 *
 * 사용법:
 *   node scripts/mission-control/mc-propagate.mjs <promise-id> [--apply]
 *
 * 기본은 dry-run — 추가될 markdown row를 출력만 한다.
 * `--apply`를 붙이면 실제로 feature-specs.md와 covering Evidence Ledger의 표에 row를 append한다.
 *
 * 안전 가드:
 *   - feature-specs.md의 `## Acceptance Check Ledger` 표 헤더가 있어야 한다.
 *   - covering Evidence Ledger의 `## Acceptance Checks` 섹션 안에
 *     `> check:evidence-coverage` blockquote 표가 이미 있어야 한다.
 *   - 둘 중 하나라도 없으면 STATUS: NEEDS_HUMAN으로 멈춘다 (사람이 첫 표를 만든다).
 *   - 이미 존재하는 (promiseId, acId) 조합은 건너뛴다.
 */

import { existsSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseMarkdown,
  getFrontmatter,
  getSection,
  getTableRows,
  getCheckEvidenceCoverageRows,
} from "./lib/markdown-ast.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const PROMISES_DIR = "docs/contracts/story-chain/promises";
const FEATURE_SPECS_PATH = "docs/contracts/feature-specs.md";

function fail(message, recommendation) {
  process.stderr.write(`STATUS: NEEDS_HUMAN\nROW: mc:propagate\nWHY: ${message}\n`);
  if (recommendation) process.stderr.write(`RECOMMENDATION: ${recommendation}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      options[arg.slice(2)] = true;
    } else {
      positional.push(arg);
    }
  }
  return { positional, options };
}

function repoPath(...parts) {
  return join(REPO_ROOT, ...parts);
}

function findPromiseFile(idOrSlug) {
  const slug = idOrSlug.replace(/^promise:/, "");
  const path = `${PROMISES_DIR}/${slug}.md`;
  if (!existsSync(repoPath(path))) {
    fail(`Promise file not found: ${path}`, `Run mc:add-promise <slug> first.`);
  }
  return path;
}

function ledgerKey(promiseId, acId) {
  return `${promiseId.replace(/`/g, "").trim()}|${acId.replace(/`/g, "").trim()}`;
}

function existingFeatureSpecsKeys(content) {
  const ast = parseMarkdown(content);
  const rows = getTableRows(getSection(ast, 2, "Acceptance Check Ledger"));
  return new Set(
    rows
      .map((row) => {
        const promiseId = row.promise ?? row.story ?? row.us ?? "";
        const acId = row["acceptance check"] ?? row["acceptance criterion"] ?? row.ac ?? "";
        if (!promiseId || !acId) return null;
        return ledgerKey(promiseId, acId);
      })
      .filter(Boolean),
  );
}

function existingCheckCoverageKeys(content) {
  const ast = parseMarkdown(content);
  const sectionNodes = getSection(ast, 2, "Acceptance Checks");
  const rows = getCheckEvidenceCoverageRows(sectionNodes);
  if (rows === null) return null; // table missing
  return new Set(
    rows
      .map((row) => {
        const promiseId = row.promise ?? row.story ?? row.us ?? "";
        const acId =
          row.check ?? row["acceptance check"] ?? row["acceptance criterion"] ?? row.ac ?? "";
        if (!promiseId || !acId) return null;
        return ledgerKey(promiseId, acId);
      })
      .filter(Boolean),
  );
}

function isTableSeparator(line) {
  return /^\|(\s*:?-+:?\s*\|)+\s*$/.test(line);
}

function isBlockquoteTableSeparator(line) {
  return /^>\s*\|(\s*:?-+:?\s*\|)+\s*$/.test(line);
}

function isCheckCoverageMarker(line) {
  return /^>\s*check:evidence-coverage\s*$/i.test(line);
}

/**
 * 일반 markdown 표(섹션 안 첫 표)에 row를 append.
 */
function appendRowsToSectionTable(content, sectionHeading, newRowLines) {
  const headingPattern = new RegExp(`^##\\s+${sectionHeading}\\s*$`, "m");
  const headingMatch = headingPattern.exec(content);
  if (!headingMatch) return null;

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const restAfterHeading = content.slice(sectionStart);
  const nextHeadingMatch = /^##\s+/m.exec(restAfterHeading);
  const sectionEnd = nextHeadingMatch ? sectionStart + nextHeadingMatch.index : content.length;
  const sectionBody = content.slice(sectionStart, sectionEnd);

  const lines = sectionBody.split("\n");
  let separatorIdx = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (isTableSeparator(lines[i])) separatorIdx = i;
  }
  if (separatorIdx === -1) return null;

  let lastDataRowIdx = -1;
  for (let i = separatorIdx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith("|")) continue;
    if (isTableSeparator(line)) continue;
    lastDataRowIdx = i;
  }

  const insertIdx = lastDataRowIdx >= 0 ? lastDataRowIdx + 1 : separatorIdx + 1;
  const updated = [...lines];
  updated.splice(insertIdx, 0, ...newRowLines);
  const newBody = updated.join("\n");
  return content.slice(0, sectionStart) + newBody + content.slice(sectionEnd);
}

/**
 * `> check:evidence-coverage` blockquote 표(섹션 안)에 row를 append.
 * 각 행 앞에 `> ` 접두사를 보존한다.
 *
 * marker 라인을 먼저 찾고, 그 다음에 나타나는 첫 separator 기준으로 append한다.
 * parser(`findCheckEvidenceCoverageBlockquotes`)와 동일한 blockquote를 가리키게 해
 * 같은 섹션에 다른 blockquote table이 있어도 parser와 propagate가 어긋나지 않는다.
 */
function appendRowsToCheckCoverageTable(content, newRowLines) {
  const headingPattern = /^##\s+Acceptance Checks\s*$/m;
  const headingMatch = headingPattern.exec(content);
  if (!headingMatch) return null;

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const restAfterHeading = content.slice(sectionStart);
  const nextHeadingMatch = /^##\s+/m.exec(restAfterHeading);
  const sectionEnd = nextHeadingMatch ? sectionStart + nextHeadingMatch.index : content.length;
  const sectionBody = content.slice(sectionStart, sectionEnd);

  const lines = sectionBody.split("\n");
  let markerIdx = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (isCheckCoverageMarker(lines[i])) {
      markerIdx = i;
      break;
    }
  }
  if (markerIdx === -1) return null;

  // marker 이후 같은 blockquote 안에서 첫 separator를 찾는다 (`>` 접두사가 끊기면 stop).
  let separatorIdx = -1;
  for (let i = markerIdx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith(">")) break;
    if (isBlockquoteTableSeparator(line)) {
      separatorIdx = i;
      break;
    }
  }
  if (separatorIdx === -1) return null;

  let lastDataRowIdx = -1;
  for (let i = separatorIdx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith(">")) break;
    if (!/^>\s*\|/.test(line)) continue;
    if (isBlockquoteTableSeparator(line)) continue;
    lastDataRowIdx = i;
  }

  const insertIdx = lastDataRowIdx >= 0 ? lastDataRowIdx + 1 : separatorIdx + 1;
  const updated = [...lines];
  const prefixed = newRowLines.map((line) => `> ${line}`);
  updated.splice(insertIdx, 0, ...prefixed);
  const newBody = updated.join("\n");
  return content.slice(0, sectionStart) + newBody + content.slice(sectionEnd);
}

function readWithMtime(absPath) {
  const content = readFileSync(absPath, "utf8");
  const mtimeMs = statSync(absPath).mtimeMs;
  return { content, mtimeMs };
}

function atomicWriteIfUnchanged(absPath, expectedMtimeMs, newContent) {
  if (existsSync(absPath)) {
    const currentMtime = statSync(absPath).mtimeMs;
    if (currentMtime !== expectedMtimeMs) {
      fail(
        `${absPath} was modified by another process between read and write.`,
        "Re-run mc:propagate after reviewing the new state.",
      );
    }
  }
  const tmpPath = `${absPath}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync(tmpPath, newContent, "utf8");
  renameSync(tmpPath, absPath);
}

function main() {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const promiseId = positional[0];
  if (!promiseId) fail("Missing <promise-id>");

  const apply = options.apply === true;
  const promiseRelPath = findPromiseFile(promiseId);
  const promiseAst = parseMarkdown(readFileSync(repoPath(promiseRelPath), "utf8"));
  const frontmatter = getFrontmatter(promiseAst);

  const id = typeof frontmatter.id === "string" ? frontmatter.id.trim() : promiseId;
  const acs = Array.isArray(frontmatter.acceptanceChecks)
    ? frontmatter.acceptanceChecks.filter((entry) => typeof entry === "string")
    : [];
  const coveringLedgers = Array.isArray(frontmatter.coveringLedgers)
    ? frontmatter.coveringLedgers.filter((entry) => typeof entry === "string")
    : [];

  if (acs.length === 0) fail(`${id} has no acceptanceChecks in frontmatter`);
  if (coveringLedgers.length === 0) fail(`${id} has no coveringLedgers in frontmatter`);

  const featureSpecsAbs = repoPath(FEATURE_SPECS_PATH);
  const featureSpecsRead = existsSync(featureSpecsAbs)
    ? readWithMtime(featureSpecsAbs)
    : { content: "", mtimeMs: 0 };
  const featureSpecsContent = featureSpecsRead.content;
  const existingLedger = existingFeatureSpecsKeys(featureSpecsContent);

  const ledgerRowsToAdd = [];
  for (const ac of acs) {
    if (!existingLedger.has(ledgerKey(id, ac))) {
      ledgerRowsToAdd.push(`| ${id} | ${ac} | ${coveringLedgers[0]} | (pending) |`);
    }
  }

  const coverageActions = [];
  for (const ledgerRel of coveringLedgers) {
    const ledgerAbs = repoPath(ledgerRel);
    if (!existsSync(ledgerAbs)) {
      coverageActions.push({ ledgerRel, status: "missing", rows: [] });
      continue;
    }
    const { content: ledgerContent, mtimeMs } = readWithMtime(ledgerAbs);
    const existing = existingCheckCoverageKeys(ledgerContent);
    if (existing === null) {
      coverageActions.push({
        ledgerRel,
        ledgerAbs,
        mtimeMs,
        content: ledgerContent,
        status: "missing-table",
        rows: [],
      });
      continue;
    }
    const rowsToAdd = [];
    for (const ac of acs) {
      if (!existing.has(ledgerKey(id, ac))) {
        rowsToAdd.push(`| ${id} | ${ac} | (pending) | Evidence runner | (pending) | |`);
      }
    }
    coverageActions.push({
      ledgerRel,
      ledgerAbs,
      mtimeMs,
      content: ledgerContent,
      status: "exists",
      rows: rowsToAdd,
    });
  }

  process.stdout.write(`mc:propagate - ${id}\n`);
  process.stdout.write(`  acceptance checks:    ${acs.length}\n`);
  process.stdout.write(`  covering ledgers:     ${coveringLedgers.length}\n\n`);

  process.stdout.write("Proposed changes\n");
  if (ledgerRowsToAdd.length === 0) {
    process.stdout.write(`  ${FEATURE_SPECS_PATH} Acceptance Check Ledger: clean\n`);
  } else {
    process.stdout.write(
      `  ${FEATURE_SPECS_PATH} Acceptance Check Ledger: +${ledgerRowsToAdd.length} row(s)\n`,
    );
    for (const row of ledgerRowsToAdd) process.stdout.write(`    ${row}\n`);
  }
  for (const action of coverageActions) {
    if (action.status === "missing") {
      process.stdout.write(`  ${action.ledgerRel}: MISSING ledger file\n`);
    } else if (action.status === "missing-table") {
      process.stdout.write(`  ${action.ledgerRel}: MISSING > check:evidence-coverage table\n`);
    } else if (action.rows.length === 0) {
      process.stdout.write(`  ${action.ledgerRel} check:evidence-coverage: clean\n`);
    } else {
      process.stdout.write(
        `  ${action.ledgerRel} check:evidence-coverage: +${action.rows.length} row(s)\n`,
      );
      for (const row of action.rows) process.stdout.write(`    > ${row}\n`);
    }
  }

  if (!apply) {
    process.stdout.write("\nDry-run. Run with --apply to write changes.\n");
    return;
  }

  // ── plan phase ──────────────────────────────────────
  // 모든 target에 대해 written content를 미리 계산한다. 하나라도 실패하면
  // partial propagation 없이 fail. command-level atomicity는 file-level
  // atomic write 위에 plan→apply 분리로 보강한다.
  const writes = [];

  if (ledgerRowsToAdd.length > 0) {
    const updated = appendRowsToSectionTable(
      featureSpecsContent,
      "Acceptance Check Ledger",
      ledgerRowsToAdd,
    );
    if (updated === null) {
      fail(
        `${FEATURE_SPECS_PATH} has no Acceptance Check Ledger table header.`,
        "Add a markdown table with headers `| Promise | Acceptance Check | Covering Evidence Ledger | Evidence |` under `## Acceptance Check Ledger`, then re-run.",
      );
    }
    writes.push({
      label: FEATURE_SPECS_PATH,
      absPath: featureSpecsAbs,
      mtimeMs: featureSpecsRead.mtimeMs,
      content: updated,
      rowCount: ledgerRowsToAdd.length,
    });
  }

  for (const action of coverageActions) {
    if (action.status === "missing") {
      fail(
        `${action.ledgerRel} (covering ledger from promise frontmatter) does not exist.`,
        "Create the covering Evidence Ledger file before running mc:propagate, or correct coveringLedgers in the promise frontmatter.",
      );
    }
    if (action.status === "missing-table") {
      fail(
        `${action.ledgerRel} has no > check:evidence-coverage blockquote table.`,
        "Under `## Acceptance Checks`, add `> check:evidence-coverage` followed by a blockquote table with headers `| promise | check | evidence | scope | run | scenarios |`, then re-run.",
      );
    }
    if (action.rows.length === 0) continue;
    const updated = appendRowsToCheckCoverageTable(action.content, action.rows);
    if (updated === null) {
      fail(
        `${action.ledgerRel} > check:evidence-coverage marker found but no blockquote table separator could be located.`,
        "Ensure the marker is followed (within the same blockquote) by a header row and a separator like `> | --- | --- | ... |`, then re-run.",
      );
    }
    writes.push({
      label: action.ledgerRel,
      absPath: action.ledgerAbs,
      mtimeMs: action.mtimeMs,
      content: updated,
      rowCount: action.rows.length,
    });
  }

  // ── apply phase ─────────────────────────────────────
  if (writes.length === 0) {
    process.stdout.write("\nNothing to apply.\n");
    return;
  }
  process.stdout.write("\n");
  for (const write of writes) {
    atomicWriteIfUnchanged(write.absPath, write.mtimeMs, write.content);
    process.stdout.write(`applied: ${write.label} +${write.rowCount} row(s)\n`);
  }
}

main();
