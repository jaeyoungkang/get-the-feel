#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseMarkdown,
  getFrontmatter,
  getSection,
  hasSection,
  getSubsections,
  getTableRows,
  findCheckEvidenceCoverageBlockquotes,
  getRunShellBlocks,
  extractKeyValues,
  nodeToString,
} from "./lib/markdown-ast.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const STORY_CHAIN_DIR = "docs/contracts/story-chain";
const EXPERIENCES_DIR = `${STORY_CHAIN_DIR}/experiences`;
const MOMENTS_DIR = `${STORY_CHAIN_DIR}/moments`;
const PROMISES_DIR = `${STORY_CHAIN_DIR}/promises`;
const ASPECTS_DIR = `${STORY_CHAIN_DIR}/aspects`;
const LEDGERS_DIR = `${STORY_CHAIN_DIR}/evidence-ledgers`;
const ENGINEERING_DIR = "docs/contracts/engineering";
const ASSURANCE_CLAIMS_DIR = `${ENGINEERING_DIR}/assurance-claims`;
const LIFECYCLES_DIR = `${ENGINEERING_DIR}/lifecycles`;
const CONTROLS_DIR = `${ENGINEERING_DIR}/controls`;
const ENGINEERING_EVIDENCE_KINDS_PATH = `${ENGINEERING_DIR}/evidence-kinds.md`;
const CARDINALITY_PATH = `${STORY_CHAIN_DIR}/traceability-cardinality.json`;
const FEATURE_SPECS_PATH = "docs/contracts/feature-specs.md";
const STAGED_TRIGGERS = [
  `${STORY_CHAIN_DIR}/`,
  `${ENGINEERING_DIR}/`,
  FEATURE_SPECS_PATH,
  "scripts/mission-control/",
];

const LONGITUDINAL_AC_CATEGORIES = new Set([
  "missing_ac_ledger",
  "stale_ac_reference",
  "missing_scenario_reference",
  "missing_ledger_file",
  "coverage_ledger_mismatch",
  "missing_check_coverage_table",
  "missing_run_shell",
  "orphan_evidence_row",
  "malformed_evidence_row",
]);
const CODE_TRACE_CATEGORIES = new Set(["missing_execution_target", "missing_code_trace"]);
const ASPECT_CATEGORIES = new Set([
  "pol_aspect_unverified",
  "pol_aspect_not_met",
  "pol_aspect_unknown",
]);
const INTENT_CATEGORIES = new Set([
  "invalid_sufficiency_verdict",
  "met_missing_production_evidence",
  "missing_intent_judgment_ref",
  "absorbed_promise_missing_acceptance_check",
  "invalid_intent_judgment_ref",
  "unknown_intent_verdict",
  "not_met_intent_verdict",
]);
const STRUCTURE_CATEGORIES = new Set([
  "missing_experience",
  "missing_moment",
  "experience_no_moment",
  "moment_no_promise",
  "invalid_experience_scope",
  "invalid_moment_experience",
  "invalid_promise_moment",
  "invalid_promise_experience",
  "inconsistent_promise_experience",
  "promise_no_acceptance_check",
  "promise_no_ledger_citation",
  "acceptance_check_no_evidence_row",
  "multiple_check_coverage_tables",
  "cardinality_policy_missing",
  "cardinality_policy_broken",
]);
const ENGINEERING_CATEGORIES = new Set([
  "malformed_engineering_id",
  "duplicate_engineering_id",
  "missing_engineering_section",
  "missing_engineering_reference",
  "missing_engineering_evidence_kind",
]);

const INTENT_JUDGMENTS_PATH = "docs/intent-judgments.md";

function repoPath(...parts) {
  return join(REPO_ROOT, ...parts);
}

function toRepoRelative(absPath) {
  return relative(REPO_ROOT, absPath).replaceAll("\\", "/");
}

function readText(relPath) {
  return readFileSync(repoPath(relPath), "utf8");
}

function readAst(relPath) {
  return parseMarkdown(readText(relPath));
}

function loadCardinalityPolicy() {
  const fallbackScopes = ["core-product", "support-layer", "governance"];
  if (!existsSync(repoPath(CARDINALITY_PATH))) {
    return {
      relations: [],
      relationNames: new Set(),
      experienceScopes: fallbackScopes,
      status: "missing",
    };
  }
  try {
    const raw = JSON.parse(readText(CARDINALITY_PATH));
    const relations = Array.isArray(raw.relations) ? raw.relations : [];
    const relationNames = new Set(
      relations.map((rel) => (typeof rel?.name === "string" ? rel.name : "")).filter(Boolean),
    );
    return {
      relations,
      relationNames,
      experienceScopes: Array.isArray(raw.experienceScopes) ? raw.experienceScopes : fallbackScopes,
      status: "ok",
    };
  } catch (error) {
    return {
      relations: [],
      relationNames: new Set(),
      experienceScopes: fallbackScopes,
      status: "broken",
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

function walkFiles(relDir, predicate) {
  const absDir = repoPath(relDir);
  const files = [];
  if (!existsSync(absDir)) return files;
  function walk(absPath) {
    for (const name of readdirSync(absPath)) {
      const child = join(absPath, name);
      const info = statSync(child);
      if (info.isDirectory()) {
        walk(child);
        continue;
      }
      const relPath = toRepoRelative(child);
      if (predicate(relPath)) files.push(relPath);
    }
  }
  walk(absDir);
  return files.sort();
}

function listExperiencePaths() {
  return walkFiles(
    EXPERIENCES_DIR,
    (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"),
  );
}
function listMomentPaths() {
  return walkFiles(MOMENTS_DIR, (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"));
}
function listPromisePaths() {
  return walkFiles(PROMISES_DIR, (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"));
}
function listAspectPaths() {
  return walkFiles(ASPECTS_DIR, (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"));
}
function listLedgerPaths() {
  return walkFiles(
    LEDGERS_DIR,
    (path) => path.endsWith(".ledger.md") && !path.endsWith("/_TEMPLATE.ledger.md"),
  );
}
function listAssuranceClaimPaths() {
  return walkFiles(
    ASSURANCE_CLAIMS_DIR,
    (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"),
  );
}
function listLifecyclePaths() {
  return walkFiles(
    LIFECYCLES_DIR,
    (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"),
  );
}
function listControlPaths() {
  return walkFiles(
    CONTROLS_DIR,
    (path) => path.endsWith(".md") && !path.endsWith("/_TEMPLATE.md"),
  );
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function collectIds(value, pattern) {
  return unique([...String(value ?? "").matchAll(pattern)].map((match) => match[1]));
}

function cell(row, names) {
  for (const name of names) {
    const value = row[name.toLowerCase()];
    if (value) return value.replace(/`/g, "").trim();
  }
  return "";
}

function normalizeLedgerPath(value) {
  const clean = value.replace(/`/g, "").trim();
  if (clean.startsWith(`${LEDGERS_DIR}/`)) return clean;
  if (clean.startsWith("docs/contracts/evidence-ledgers/")) {
    return `${LEDGERS_DIR}/${clean.split("/").at(-1)}`;
  }
  if (clean.startsWith("evidence-ledgers/")) {
    return `${LEDGERS_DIR}/${clean.slice("evidence-ledgers/".length)}`;
  }
  if (clean.endsWith(".ledger.md")) return `${LEDGERS_DIR}/${clean}`;
  return clean;
}

function extractLedgerPaths(value) {
  return unique(
    collectIds(
      value,
      /`?((?:docs\/contracts\/story-chain\/evidence-ledgers\/|docs\/contracts\/evidence-ledgers\/|evidence-ledgers\/)?[A-Za-z0-9._/-]+\.ledger\.md)`?/g,
    ).map(normalizeLedgerPath),
  );
}

function extractScenarioIds(value) {
  return unique([
    ...collectIds(value, /\b(SC-[A-Z0-9-]+)\b/g),
    ...collectIds(value, /\b(scenario:[a-z0-9-]+)\b/g),
  ]);
}

function extractPromiseIds(value) {
  return unique(collectIds(value, /\b(promise:[a-z0-9-]+)\b/g));
}

function extractAcceptanceCheckIds(value) {
  return unique([
    ...collectIds(value, /\b(acceptance-check:[a-z0-9-]+)\b/g),
    ...collectIds(value, /\b(AC\d+)\b/g),
  ]);
}

function extractEngineeringIds(value, prefix) {
  return unique(collectIds(value, new RegExp(`\\b(${prefix}:[a-z0-9-]+)\\b`, "g")));
}

function frontmatterStringArray(frontmatter, key) {
  const value = frontmatter[key];
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === "string" && entry.trim()).map((entry) => entry.trim());
}

function parseExperience(path) {
  const ast = readAst(path);
  const frontmatter = getFrontmatter(ast);
  const id =
    typeof frontmatter.id === "string" && frontmatter.id.trim()
      ? frontmatter.id.trim()
      : `experience:${path.replace(/^.*\/|\.md$/g, "")}`;
  return {
    id,
    path,
    scope: typeof frontmatter.scope === "string" ? frontmatter.scope.trim() : "",
  };
}

function parseMoment(path) {
  const ast = readAst(path);
  const frontmatter = getFrontmatter(ast);
  const id =
    typeof frontmatter.id === "string" && frontmatter.id.trim()
      ? frontmatter.id.trim()
      : `moment:${path.replace(/^.*\/|\.md$/g, "")}`;
  return {
    id,
    path,
    experience: typeof frontmatter.experience === "string" ? frontmatter.experience.trim() : "",
  };
}

function parsePromise(path) {
  const ast = readAst(path);
  const frontmatter = getFrontmatter(ast);
  const id =
    typeof frontmatter.id === "string" && frontmatter.id.trim()
      ? frontmatter.id.trim()
      : `promise:${path.replace(/^.*\/|\.md$/g, "")}`;

  const frontmatterChecks = Array.isArray(frontmatter.acceptanceChecks)
    ? frontmatter.acceptanceChecks.filter((entry) => typeof entry === "string")
    : [];

  const headingChecks = ast.children
    .filter((node) => node.type === "heading" && node.depth === 3)
    .map((node) => nodeToString(node))
    .flatMap((text) => collectIds(text, /\b(acceptance-check:[a-z0-9-]+|AC\d+)\b/g));

  return {
    id,
    path,
    experience: typeof frontmatter.experience === "string" ? frontmatter.experience.trim() : "",
    moment: typeof frontmatter.moment === "string" ? frontmatter.moment.trim() : "",
    assuranceClaims: frontmatterStringArray(frontmatter, "assuranceClaims"),
    lifecycles: frontmatterStringArray(frontmatter, "lifecycles"),
    acceptanceChecks: unique([...frontmatterChecks, ...headingChecks]),
  };
}

function parseFeatureSpecs() {
  if (!existsSync(repoPath(FEATURE_SPECS_PATH))) {
    return { ledgerRows: [], scenarioIds: new Set() };
  }
  const ast = readAst(FEATURE_SPECS_PATH);
  const ledgerNodes = getSection(ast, 2, "Acceptance Check Ledger");
  const scenarioNodes = getSection(ast, 2, "Scenario Catalog");

  const ledgerRows = getTableRows(ledgerNodes).flatMap((row) => {
    const promiseId = cell(row, ["promise", "story", "us"]);
    const acId = cell(row, ["acceptance check", "acceptance criterion", "ac"]);
    if (!promiseId || !acId) return [];
    const ledgerCell = cell(row, [
      "covering evidence ledger",
      "covering ledger",
      "ledger",
      "evidence",
    ]);
    const evidenceCell = cell(row, ["evidence"]);
    const traceCell = `${ledgerCell} ${evidenceCell}`;
    return {
      promiseId,
      acId,
      ledgerPaths: extractLedgerPaths(traceCell),
      scenarioIds: extractScenarioIds(traceCell),
    };
  });

  const scenarioIds = new Set(
    getTableRows(scenarioNodes)
      .flatMap((row) => extractScenarioIds(cell(row, ["scenario", "sc"])))
      .filter(Boolean),
  );

  return { ledgerRows, scenarioIds };
}

function parseCheckCoverageEntries(ast) {
  const sectionNodes = getSection(ast, 2, "Acceptance Checks");
  if (sectionNodes.length === 0) {
    return { markerCount: 0, hasTable: false, entries: [], malformedRows: [] };
  }

  const matches = findCheckEvidenceCoverageBlockquotes(sectionNodes);
  // markerCount = 모든 match의 markerLines 합. 한 blockquote 안에 마커가 2개여도
  // 잡히고, 두 blockquote에 각각 1개씩 있어도 합이 2.
  const markerCount = matches.reduce((sum, m) => sum + m.markerLines, 0);

  if (markerCount === 0) {
    return { markerCount: 0, hasTable: false, entries: [], malformedRows: [] };
  }
  if (markerCount > 1) {
    return { markerCount, hasTable: false, entries: [], malformedRows: [] };
  }
  // markerCount === 1: 단일 마커 라인을 가진 blockquote 하나
  const match = matches.find((m) => m.markerLines === 1);
  if (!match || !match.tableNode) {
    return { markerCount: 1, hasTable: false, entries: [], malformedRows: [] };
  }

  // Each row must point to exactly one Promise and exactly one Acceptance Check.
  // Row index is 1-based to match human reading of the table body (header excluded).
  const rows = match.rows ?? [];
  const entries = [];
  const malformedRows = [];
  rows.forEach((row, index) => {
    const promiseCell = cell(row, ["promise", "story", "us"]);
    const acCell = cell(row, ["check", "acceptance check", "acceptance criterion", "ac"]);
    const promiseIds = extractPromiseIds(promiseCell);
    const acIds = extractAcceptanceCheckIds(acCell);
    if (promiseIds.length !== 1 || acIds.length !== 1) {
      malformedRows.push({
        rowNumber: index + 1,
        promiseCell,
        acCell,
        promiseIdCount: promiseIds.length,
        acIdCount: acIds.length,
      });
      return;
    }
    entries.push({ promiseId: promiseIds[0], acId: acIds[0] });
  });

  const dedupedEntries = unique(entries.map((e) => `${e.promiseId}|${e.acId}`)).map((key) => {
    const [promiseId, acId] = key.split("|");
    return { promiseId, acId };
  });

  return {
    markerCount: 1,
    hasTable: true,
    entries: dedupedEntries,
    malformedRows,
  };
}

function extractExecutionTargets(command) {
  const targets = [];
  const pattern =
    /(?:^|\s|["'`])((?:src|scripts|specs|docs)\/[^\s"'`]+?\.(?:ts|tsx|js|jsx|mjs|cjs|md))/g;
  let match;
  while ((match = pattern.exec(command)) !== null) {
    const target = (match[1] ?? "").replace(/[),;]+$/g, "");
    if (target) targets.push(target);
  }
  return unique(targets);
}

function resolveTarget(target) {
  const candidates = [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}.js`,
    `${target}.jsx`,
    target.endsWith(".ts") ? `${target.slice(0, -3)}.tsx` : "",
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(repoPath(candidate))) ?? target;
}

function tryResolveImport(fromRelPath, specifier) {
  const fromAbsPath = repoPath(fromRelPath);
  const basePath = specifier.startsWith("@/")
    ? repoPath("src", specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(fromAbsPath), specifier)
      : null;
  if (!basePath) return null;
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.mjs`,
    `${basePath}.cjs`,
    join(basePath, "index.ts"),
    join(basePath, "index.tsx"),
    join(basePath, "index.js"),
  ];
  const resolved = candidates.find((candidate) => existsSync(candidate));
  return resolved ? toRepoRelative(resolved) : null;
}

function collectSrcImports(relPath) {
  if (!existsSync(repoPath(relPath))) return [];
  const source = readText(relPath);
  const imports = [];
  const patterns = [
    /from\s+["']([^"']+)["']/g,
    /import\s+["']([^"']+)["']/g,
    /require\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const resolved = tryResolveImport(relPath, match[1] ?? "");
      if (resolved?.startsWith("src/") || resolved?.startsWith("scripts/")) imports.push(resolved);
    }
  }
  return unique(imports);
}

function parseSufficiencyEntries(ast) {
  const sectionNodes = getSection(ast, 2, "Sufficiency Review");
  if (sectionNodes.length === 0) return [];

  const subsections = getSubsections(sectionNodes, 3);
  return subsections.map((sub) => {
    const kv = extractKeyValues(sub.nodes, ["Verdict", "Evidence", "polId"]);
    return {
      heading: sub.heading,
      block: nodeToString({ type: "root", children: sub.nodes }),
      verdict: kv.Verdict?.toLowerCase() ?? null,
      evidence: kv.Evidence ?? "",
      polId: kv.polId ?? "",
    };
  });
}

function parseIntentJudgmentRefs(value) {
  if (value === undefined || value === null) return { valid: [], invalid: [] };
  if (!Array.isArray(value)) {
    return {
      valid: [],
      invalid: [{ raw: JSON.stringify(value), reason: "expected array of strings" }],
    };
  }
  const valid = [];
  const invalid = [];
  for (const entry of value) {
    if (typeof entry !== "string") {
      invalid.push({ raw: JSON.stringify(entry), reason: "not a string" });
      continue;
    }
    const match = entry.match(/^(promise:[a-z0-9-]+)\s*->\s*(.+)$/);
    if (!match) {
      invalid.push({ raw: entry, reason: "expected `promise:slug -> anchor`" });
      continue;
    }
    valid.push({ promiseId: match[1].trim(), anchor: match[2].trim() });
  }
  return { valid, invalid };
}

function loadIntentJudgmentAnchors() {
  if (!existsSync(repoPath(INTENT_JUDGMENTS_PATH))) return new Set();
  const ast = readAst(INTENT_JUDGMENTS_PATH);
  const anchors = new Set();
  for (const node of ast.children) {
    if (node.type !== "heading") continue;
    const text = nodeToString(node);
    anchors.add(text);
    for (const match of text.matchAll(
      /\b(promise:[a-z0-9-]+|AC\d+|acceptance-check:[a-z0-9-]+)\b/g,
    )) {
      anchors.add(match[1]);
    }
  }
  return anchors;
}

function parseLedger(path) {
  const ast = readAst(path);
  const frontmatter = getFrontmatter(ast);
  const runBlocks = getRunShellBlocks(ast.children);
  const runChecks = runBlocks.map((block) => {
    const executionTargets = extractExecutionTargets(block.command).map(resolveTarget);
    const missingTargets = executionTargets.filter((target) => !existsSync(repoPath(target)));
    const codeTargets = new Set();
    for (const target of executionTargets) {
      if (!existsSync(repoPath(target))) continue;
      if (
        (target.startsWith("src/") || target.startsWith("scripts/")) &&
        !/\.test\./.test(target)
      ) {
        codeTargets.add(target);
      }
      for (const srcImport of collectSrcImports(target)) codeTargets.add(srcImport);
    }
    return {
      command: block.command,
      executionTargets,
      missingTargets,
      codeTargets: [...codeTargets].sort(),
    };
  });

  const refs = parseIntentJudgmentRefs(frontmatter.intentJudgmentRefs);
  const checkCoverage = parseCheckCoverageEntries(ast);
  return {
    path,
    curated: frontmatter.curated === true,
    intentAbsorbedIntoAcceptance: frontmatter.intentAbsorbedIntoAcceptance === true,
    intentJudgmentRefs: refs.valid,
    intentJudgmentRefsInvalid: refs.invalid,
    assuranceClaims: unique([
      ...frontmatterStringArray(frontmatter, "assuranceClaims"),
      ...extractEngineeringIds(
        nodeToString({ type: "root", children: getSection(ast, 2, "Supporting Assurance Claims") }),
        "assurance-claim",
      ),
    ]),
    controls: unique([
      ...frontmatterStringArray(frontmatter, "controls"),
      ...extractEngineeringIds(
        nodeToString({ type: "root", children: getSection(ast, 2, "Supporting Controls") }),
        "control",
      ),
    ]),
    evidenceKinds: frontmatterStringArray(frontmatter, "evidenceKinds"),
    markerCount: checkCoverage.markerCount,
    hasCheckCoverageTable: checkCoverage.hasTable,
    coverageEntries: checkCoverage.entries,
    malformedCoverageRows: checkCoverage.malformedRows,
    runChecks,
    sufficiencyEntries: parseSufficiencyEntries(ast),
  };
}

function parseAspect(path) {
  const ast = readAst(path);
  const frontmatter = getFrontmatter(ast);
  const id =
    typeof frontmatter.id === "string" && frontmatter.id.trim()
      ? frontmatter.id.trim()
      : `aspect:${path.replace(/^.*\/|\.md$/g, "")}`;
  const coveringLedger =
    typeof frontmatter["covering-ledger"] === "string"
      ? normalizeLedgerPath(frontmatter["covering-ledger"])
      : typeof frontmatter["covering-spec"] === "string"
        ? normalizeLedgerPath(frontmatter["covering-spec"])
        : "";
  const legacyIds = Array.isArray(frontmatter.legacyIds)
    ? frontmatter.legacyIds.filter((entry) => typeof entry === "string")
    : [];
  const titleNode = ast.children.find((child) => child.type === "heading" && child.depth === 1);
  const title = titleNode ? nodeToString(titleNode) : id;
  return { id, path, coveringLedger, title, legacyIds };
}

function parseEngineeringDoc(path, prefix, requiredSections) {
  const ast = readAst(path);
  const frontmatter = getFrontmatter(ast);
  const slug = path.replace(/^.*\/|\.md$/g, "");
  const id =
    typeof frontmatter.id === "string" && frontmatter.id.trim()
      ? frontmatter.id.trim()
      : `${prefix}:${slug}`;
  return {
    id,
    path,
    status: typeof frontmatter.status === "string" ? frontmatter.status.trim() : "",
    supports: frontmatterStringArray(frontmatter, "supports"),
    claimRefs: frontmatterStringArray(frontmatter, "claimRefs"),
    requiredSections,
    missingSections: requiredSections.filter((section) => !hasSection(ast, 2, section)),
  };
}

function parseEvidenceKinds() {
  const kinds = new Set(["runtime-output", "rendered-dom", "human-approval"]);
  if (!existsSync(repoPath(ENGINEERING_EVIDENCE_KINDS_PATH))) return kinds;
  const ast = readAst(ENGINEERING_EVIDENCE_KINDS_PATH);
  for (const row of getTableRows(ast.children)) {
    const kind = cell(row, ["kind"]).replace(/`/g, "").trim();
    if (kind) kinds.add(kind);
  }
  return kinds;
}

function createFinding(input, findings) {
  return { id: `finding-${findings.length + 1}`, ...input };
}

function addFinding(findings, input) {
  findings.push(createFinding(input, findings));
}

function buildSnapshot() {
  const cardinality = loadCardinalityPolicy();
  const allowedScopes = new Set(cardinality.experienceScopes);

  const experiencePaths = listExperiencePaths();
  const momentPaths = listMomentPaths();
  const promisePaths = listPromisePaths();
  const aspectPaths = listAspectPaths();
  const ledgerPaths = listLedgerPaths();
  const assuranceClaimPaths = listAssuranceClaimPaths();
  const lifecyclePaths = listLifecyclePaths();
  const controlPaths = listControlPaths();
  const skipped =
    experiencePaths.length === 0 &&
    momentPaths.length === 0 &&
    promisePaths.length === 0 &&
    aspectPaths.length === 0 &&
    ledgerPaths.length === 0;

  const experiences = experiencePaths.map(parseExperience);
  const moments = momentPaths.map(parseMoment);
  const promises = promisePaths.map(parsePromise);
  const aspects = aspectPaths.map(parseAspect);
  const ledgers = ledgerPaths.map(parseLedger);
  const assuranceClaims = assuranceClaimPaths.map((path) =>
    parseEngineeringDoc(path, "assurance-claim", [
      "Invariant",
      "Supported Promises",
      "Controls",
      "Evidence Expectations",
    ]),
  );
  const lifecycles = lifecyclePaths.map((path) =>
    parseEngineeringDoc(path, "lifecycle", [
      "States",
      "Allowed Transitions",
      "Forbidden Transitions",
      "Evidence Expectations",
    ]),
  );
  const controls = controlPaths.map((path) =>
    parseEngineeringDoc(path, "control", [
      "Trigger",
      "Owner",
      "Command Or Procedure",
      "Rollback Or Irreversible Boundary",
      "Evidence Expectations",
    ]),
  );
  const evidenceKinds = parseEvidenceKinds();
  const { ledgerRows, scenarioIds } = parseFeatureSpecs();
  const findings = [];

  const experienceById = new Map(experiences.map((exp) => [exp.id, exp]));
  const momentById = new Map(moments.map((moment) => [moment.id, moment]));
  const promiseById = new Map(promises.map((promise) => [promise.id, promise]));
  const ledgerByAc = new Map(ledgerRows.map((row) => [`${row.promiseId}|${row.acId}`, row]));
  const ledgerByPath = new Map(ledgers.map((ledger) => [ledger.path, ledger]));
  const assuranceClaimById = new Map(assuranceClaims.map((claim) => [claim.id, claim]));
  const lifecycleById = new Map(lifecycles.map((lifecycle) => [lifecycle.id, lifecycle]));
  const controlById = new Map(controls.map((control) => [control.id, control]));

  // ── Cardinality policy file health ────────────────────────
  if (!skipped && cardinality.status === "missing") {
    addFinding(findings, {
      severity: "critical",
      category: "cardinality_policy_missing",
      title: `${CARDINALITY_PATH} not found — Story Chain has no cardinality policy of record`,
      evidence: [CARDINALITY_PATH],
    });
  }
  if (cardinality.status === "broken") {
    addFinding(findings, {
      severity: "critical",
      category: "cardinality_policy_broken",
      title: `${CARDINALITY_PATH} failed to parse: ${cardinality.reason ?? "unknown"}`,
      evidence: [CARDINALITY_PATH],
    });
  }

  // ── Engineering Assurance parse-only warning layer ────────
  const engineeringEntries = [
    ...assuranceClaims.map((entry) => ({ ...entry, prefix: "assurance-claim" })),
    ...lifecycles.map((entry) => ({ ...entry, prefix: "lifecycle" })),
    ...controls.map((entry) => ({ ...entry, prefix: "control" })),
  ];
  const engineeringIdCounts = new Map();
  for (const entry of engineeringEntries) {
    engineeringIdCounts.set(entry.id, (engineeringIdCounts.get(entry.id) ?? 0) + 1);
    if (!new RegExp(`^${entry.prefix}:[a-z0-9-]+$`).test(entry.id)) {
      addFinding(findings, {
        severity: "warning",
        category: "malformed_engineering_id",
        title: `${entry.path} declares malformed ${entry.prefix} id "${entry.id}"`,
        evidence: [entry.path],
      });
    }
    for (const section of entry.missingSections) {
      addFinding(findings, {
        severity: "warning",
        category: "missing_engineering_section",
        title: `${entry.id} is missing required section "## ${section}"`,
        evidence: [entry.path],
      });
    }
  }
  for (const [id, count] of engineeringIdCounts) {
    if (count <= 1) continue;
    addFinding(findings, {
      severity: "warning",
      category: "duplicate_engineering_id",
      title: `${id} is declared ${count} times in Engineering Assurance docs`,
      evidence: engineeringEntries.filter((entry) => entry.id === id).map((entry) => entry.path),
    });
  }
  for (const claim of assuranceClaims) {
    for (const promiseId of claim.supports) {
      if (!promiseById.has(promiseId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${claim.id} supports missing ${promiseId}`,
          evidence: [claim.path],
        });
      }
    }
  }
  for (const lifecycle of lifecycles) {
    for (const promiseId of lifecycle.supports) {
      if (!promiseById.has(promiseId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${lifecycle.id} supports missing ${promiseId}`,
          evidence: [lifecycle.path],
        });
      }
    }
  }
  for (const control of controls) {
    for (const claimId of control.claimRefs) {
      if (!assuranceClaimById.has(claimId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${control.id} points to missing ${claimId}`,
          evidence: [control.path],
        });
      }
    }
  }

  // ── Structure: Experience scope ───────────────────────────
  for (const exp of experiences) {
    if (!exp.scope) {
      addFinding(findings, {
        severity: "critical",
        category: "invalid_experience_scope",
        title: `${exp.id} is missing required frontmatter scope:`,
        storyId: exp.id,
        evidence: [exp.path],
      });
      continue;
    }
    if (!allowedScopes.has(exp.scope)) {
      addFinding(findings, {
        severity: "critical",
        category: "invalid_experience_scope",
        title: `${exp.id} declares unknown scope "${exp.scope}" (allowed: ${[...allowedScopes].join(", ")})`,
        storyId: exp.id,
        evidence: [exp.path],
      });
    }
  }

  // ── Structure: Moment → Experience ────────────────────────
  for (const moment of moments) {
    if (!moment.experience) {
      addFinding(findings, {
        severity: "critical",
        category: "invalid_moment_experience",
        title: `${moment.id} is missing required frontmatter experience:`,
        storyId: moment.id,
        evidence: [moment.path],
      });
      continue;
    }
    if (!experienceById.has(moment.experience)) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_experience",
        title: `${moment.id} points to missing ${moment.experience}`,
        storyId: moment.id,
        evidence: [moment.path],
      });
    }
  }

  // ── Structure: Promise → Moment / Experience ──────────────
  for (const promise of promises) {
    if (!promise.experience) {
      addFinding(findings, {
        severity: "critical",
        category: "invalid_promise_experience",
        title: `${promise.id} is missing required frontmatter experience:`,
        storyId: promise.id,
        evidence: [promise.path],
      });
    } else if (!experienceById.has(promise.experience)) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_experience",
        title: `${promise.id} points to missing ${promise.experience}`,
        storyId: promise.id,
        evidence: [promise.path],
      });
    }
    if (!promise.moment) {
      addFinding(findings, {
        severity: "critical",
        category: "invalid_promise_moment",
        title: `${promise.id} is missing required frontmatter moment:`,
        storyId: promise.id,
        evidence: [promise.path],
      });
    } else if (!momentById.has(promise.moment)) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_moment",
        title: `${promise.id} points to missing ${promise.moment}`,
        storyId: promise.id,
        evidence: [promise.path],
      });
    } else if (promise.experience && experienceById.has(promise.experience)) {
      // Promise.experience must match the Moment's declared experience.
      // Without this, a Promise can declare experience:A but live under moment:B/experience:C.
      const moment = momentById.get(promise.moment);
      if (moment.experience && moment.experience !== promise.experience) {
        addFinding(findings, {
          severity: "critical",
          category: "inconsistent_promise_experience",
          title: `${promise.id} declares ${promise.experience} but ${promise.moment} belongs to ${moment.experience}`,
          storyId: promise.id,
          evidence: [promise.path, moment.path],
        });
      }
    }
    for (const claimId of promise.assuranceClaims) {
      if (!assuranceClaimById.has(claimId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${promise.id} points to missing ${claimId}`,
          storyId: promise.id,
          evidence: [promise.path],
        });
      }
    }
    for (const lifecycleId of promise.lifecycles) {
      if (!lifecycleById.has(lifecycleId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${promise.id} points to missing ${lifecycleId}`,
          storyId: promise.id,
          evidence: [promise.path],
        });
      }
    }
  }

  // ── Cardinality: Experience → Moment(1..*) ────────────────
  if (cardinality.relationNames.has("experience_moments")) {
    const momentExperiences = new Set(moments.map((m) => m.experience).filter(Boolean));
    for (const exp of experiences) {
      if (!momentExperiences.has(exp.id)) {
        addFinding(findings, {
          severity: "critical",
          category: "experience_no_moment",
          title: `${exp.id} has no Moment (cardinality experience_moments 1..*)`,
          storyId: exp.id,
          evidence: [exp.path],
        });
      }
    }
  }

  // ── Cardinality: Moment → Promise(1..*) ───────────────────
  if (cardinality.relationNames.has("moment_promises")) {
    const promiseMoments = new Set(promises.map((p) => p.moment).filter(Boolean));
    for (const moment of moments) {
      if (!promiseMoments.has(moment.id)) {
        addFinding(findings, {
          severity: "critical",
          category: "moment_no_promise",
          title: `${moment.id} has no Promise (cardinality moment_promises 1..*)`,
          storyId: moment.id,
          evidence: [moment.path],
        });
      }
    }
  }

  // ── Cardinality: Promise → Acceptance Check(1..*) ─────────
  if (cardinality.relationNames.has("promise_acceptance_checks")) {
    for (const promise of promises) {
      if (promise.acceptanceChecks.length === 0) {
        addFinding(findings, {
          severity: "critical",
          category: "promise_no_acceptance_check",
          title: `${promise.id} declares no acceptance checks (cardinality promise_acceptance_checks 1..*)`,
          storyId: promise.id,
          evidence: [promise.path],
        });
      }
    }
  }

  // ── Cardinality: Promise → Evidence Ledger(1..*) ──────────
  if (cardinality.relationNames.has("promise_evidence_ledgers")) {
    const promisesCitedByLedgers = new Set(
      ledgers.flatMap((ledger) => ledger.coverageEntries.map((entry) => entry.promiseId)),
    );
    for (const promise of promises) {
      if (!promisesCitedByLedgers.has(promise.id)) {
        addFinding(findings, {
          severity: "critical",
          category: "promise_no_ledger_citation",
          title: `${promise.id} is not cited by any Evidence Ledger check:evidence-coverage row (cardinality promise_evidence_ledgers 1..*)`,
          storyId: promise.id,
          evidence: [promise.path],
        });
      }
    }
  }

  // ── Cardinality: Acceptance Check → Evidence row(1..*) ────
  // Each Promise#AcceptanceCheck must appear in at least one Evidence Ledger
  // check:evidence-coverage row. This is direct ledger cardinality, distinct
  // from the feature-specs.md missing_ac_ledger / coverage_ledger_mismatch
  // checks which validate the cross-ledger inventory.
  if (cardinality.relationNames.has("acceptance_check_evidence")) {
    const evidenceRowKeys = new Set(
      ledgers.flatMap((ledger) =>
        ledger.coverageEntries.map((entry) => `${entry.promiseId}|${entry.acId}`),
      ),
    );
    for (const promise of promises) {
      for (const acId of promise.acceptanceChecks) {
        if (!evidenceRowKeys.has(`${promise.id}|${acId}`)) {
          addFinding(findings, {
            severity: "critical",
            category: "acceptance_check_no_evidence_row",
            title: `${promise.id} ${acId} has no Evidence Ledger check:evidence-coverage row (cardinality acceptance_check_evidence 1..*)`,
            storyId: promise.id,
            acId,
            evidence: [promise.path],
          });
        }
      }
    }

    // Reverse direction: every check:evidence-coverage row must point to a
    // currently declared Promise#AC. Orphan rows survive when a promise or
    // an AC is renamed/removed but the ledger row stays behind.
    for (const ledger of ledgers) {
      for (const entry of ledger.coverageEntries) {
        const promise = promiseById.get(entry.promiseId);
        if (!promise || !promise.acceptanceChecks.includes(entry.acId)) {
          addFinding(findings, {
            severity: "critical",
            category: "orphan_evidence_row",
            title: `${ledger.path} check:evidence-coverage row ${entry.promiseId}#${entry.acId} does not match any currently declared Promise/AC`,
            storyId: entry.promiseId,
            acId: entry.acId,
            ledgerPath: ledger.path,
            evidence: [ledger.path],
          });
        }
      }
    }
  }

  // ── Promise → AC → Ledger row ─────────────────────────────
  for (const promise of promises) {
    for (const acId of promise.acceptanceChecks) {
      if (!ledgerByAc.has(`${promise.id}|${acId}`)) {
        addFinding(findings, {
          severity: "critical",
          category: "missing_ac_ledger",
          title: `${promise.id} ${acId} is missing from feature-specs.md`,
          storyId: promise.id,
          acId,
          evidence: [promise.path, FEATURE_SPECS_PATH],
        });
      }
    }
  }

  for (const row of ledgerRows) {
    const promise = promiseById.get(row.promiseId);
    if (!promise || !promise.acceptanceChecks.includes(row.acId)) {
      addFinding(findings, {
        severity: "critical",
        category: "stale_ac_reference",
        title: `${row.promiseId} ${row.acId} is stale in feature-specs.md`,
        storyId: row.promiseId,
        acId: row.acId,
        evidence: [FEATURE_SPECS_PATH],
      });
    }

    for (const scenarioId of row.scenarioIds) {
      if (!scenarioIds.has(scenarioId)) {
        addFinding(findings, {
          severity: "critical",
          category: "missing_scenario_reference",
          title: `${row.promiseId} ${row.acId} points to missing ${scenarioId}`,
          storyId: row.promiseId,
          acId: row.acId,
          evidence: [FEATURE_SPECS_PATH],
        });
      }
    }

    if (row.ledgerPaths.length === 0) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_ledger_file",
        title: `${row.promiseId} ${row.acId} has no covering ledger path`,
        storyId: row.promiseId,
        acId: row.acId,
        evidence: [FEATURE_SPECS_PATH],
      });
    }

    for (const ledgerPath of row.ledgerPaths) {
      const ledger = ledgerByPath.get(ledgerPath);
      if (!ledger) {
        addFinding(findings, {
          severity: "critical",
          category: "missing_ledger_file",
          title: `${row.promiseId} ${row.acId} points to missing ${ledgerPath}`,
          storyId: row.promiseId,
          acId: row.acId,
          ledgerPath,
          evidence: [FEATURE_SPECS_PATH],
        });
        continue;
      }
      const covered = ledger.coverageEntries.some(
        (entry) => entry.promiseId === row.promiseId && entry.acId === row.acId,
      );
      if (!covered) {
        addFinding(findings, {
          severity: "critical",
          category: "coverage_ledger_mismatch",
          title: `${row.promiseId} ${row.acId} is absent from ${ledgerPath} check:evidence-coverage table`,
          storyId: row.promiseId,
          acId: row.acId,
          ledgerPath,
          evidence: [FEATURE_SPECS_PATH, ledgerPath],
        });
      }
    }
  }

  for (const ledger of ledgers) {
    for (const claimId of ledger.assuranceClaims) {
      if (!assuranceClaimById.has(claimId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${ledger.path} points to missing ${claimId}`,
          ledgerPath: ledger.path,
          evidence: [ledger.path],
        });
      }
    }
    for (const controlId of ledger.controls) {
      if (!controlById.has(controlId)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_reference",
          title: `${ledger.path} points to missing ${controlId}`,
          ledgerPath: ledger.path,
          evidence: [ledger.path],
        });
      }
    }
    for (const kind of ledger.evidenceKinds) {
      if (!evidenceKinds.has(kind)) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_engineering_evidence_kind",
          title: `${ledger.path} points to missing evidence kind "${kind}"`,
          ledgerPath: ledger.path,
          evidence: [ledger.path, ENGINEERING_EVIDENCE_KINDS_PATH],
        });
      }
    }
    for (const malformed of ledger.malformedCoverageRows ?? []) {
      addFinding(findings, {
        severity: "critical",
        category: "malformed_evidence_row",
        title: `${ledger.path} check:evidence-coverage row #${malformed.rowNumber} must reference exactly one promise:* and one acceptance-check:* (got ${malformed.promiseIdCount} promise IDs in "${malformed.promiseCell}", ${malformed.acIdCount} check IDs in "${malformed.acCell}")`,
        ledgerPath: ledger.path,
        evidence: [ledger.path],
      });
    }
    if (ledger.markerCount > 1) {
      addFinding(findings, {
        severity: "critical",
        category: "multiple_check_coverage_tables",
        title: `${ledger.path} Acceptance Checks section has ${ledger.markerCount} > check:evidence-coverage markers (exactly 1 required)`,
        ledgerPath: ledger.path,
        evidence: [ledger.path],
      });
    } else if (!ledger.hasCheckCoverageTable) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_check_coverage_table",
        title:
          ledger.markerCount === 1
            ? `${ledger.path} > check:evidence-coverage marker has no table body`
            : `${ledger.path} Acceptance Checks section is missing the > check:evidence-coverage table`,
        ledgerPath: ledger.path,
        evidence: [ledger.path],
      });
    }
    if (ledger.runChecks.length === 0) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_run_shell",
        title: `${ledger.path} has no run:shell block`,
        ledgerPath: ledger.path,
        evidence: [ledger.path],
      });
    }
    for (const runCheck of ledger.runChecks) {
      if (runCheck.missingTargets.length > 0) {
        addFinding(findings, {
          severity: "critical",
          category: "missing_execution_target",
          title: `${ledger.path} points to missing execution targets`,
          ledgerPath: ledger.path,
          command: runCheck.command,
          evidence: [ledger.path, ...runCheck.missingTargets],
        });
      }
      if (
        runCheck.executionTargets.length > 0 &&
        runCheck.missingTargets.length === 0 &&
        runCheck.codeTargets.length === 0
      ) {
        addFinding(findings, {
          severity: "warning",
          category: "missing_code_trace",
          title: `${ledger.path} run:shell does not trace to src/ code`,
          ledgerPath: ledger.path,
          command: runCheck.command,
          evidence: [ledger.path, ...runCheck.executionTargets],
        });
      }
    }

    for (const entry of ledger.sufficiencyEntries) {
      if (!["met", "not-met", "unknown"].includes(entry.verdict)) {
        addFinding(findings, {
          severity: "critical",
          category: "invalid_sufficiency_verdict",
          title: `${ledger.path} Sufficiency Review entry has no valid Verdict`,
          ledgerPath: ledger.path,
          evidence: [ledger.path],
        });
        continue;
      }
      if (entry.verdict === "met" && !/(runtime-output|rendered-dom)/i.test(entry.evidence)) {
        addFinding(findings, {
          severity: "critical",
          category: "met_missing_production_evidence",
          title: `${ledger.path} declares met without production-equivalent Evidence`,
          ledgerPath: ledger.path,
          evidence: [ledger.path],
        });
      }
      if (entry.verdict === "unknown") {
        addFinding(findings, {
          severity: "critical",
          category: "unknown_intent_verdict",
          title: `${ledger.path} Sufficiency Review "${entry.heading}" verdict is unknown — judgment debt`,
          ledgerPath: ledger.path,
          evidence: [ledger.path],
        });
      }
      if (entry.verdict === "not-met") {
        addFinding(findings, {
          severity: "critical",
          category: "not_met_intent_verdict",
          title: `${ledger.path} Sufficiency Review "${entry.heading}" verdict is not-met`,
          ledgerPath: ledger.path,
          evidence: [ledger.path],
        });
      }
    }
  }

  // 9번째 축 — Curated Evidence Ledger / intent-absorbed subtype / Human Judgment Gate refs
  const intentJudgmentAnchors = loadIntentJudgmentAnchors();
  for (const ledger of ledgers) {
    for (const invalidRef of ledger.intentJudgmentRefsInvalid) {
      addFinding(findings, {
        severity: "critical",
        category: "invalid_intent_judgment_ref",
        title: `${ledger.path} intentJudgmentRefs entry malformed: ${invalidRef.raw} (${invalidRef.reason})`,
        ledgerPath: ledger.path,
        evidence: [ledger.path],
      });
    }

    if (!ledger.intentAbsorbedIntoAcceptance) continue;

    if (ledger.intentJudgmentRefs.length === 0) {
      addFinding(findings, {
        severity: "critical",
        category: "missing_intent_judgment_ref",
        title: `${ledger.path} declares intentAbsorbedIntoAcceptance but lists no intentJudgmentRefs`,
        ledgerPath: ledger.path,
        evidence: [ledger.path],
      });
      continue;
    }

    for (const ref of ledger.intentJudgmentRefs) {
      // anchor 정확 매칭만 인정 (promiseId fallback 제거 — 우회로 차단)
      if (!intentJudgmentAnchors.has(ref.anchor)) {
        addFinding(findings, {
          severity: "critical",
          category: "missing_intent_judgment_ref",
          title: `${ledger.path} intentJudgmentRefs ${ref.promiseId} -> ${ref.anchor} not found in ${INTENT_JUDGMENTS_PATH}`,
          ledgerPath: ledger.path,
          storyId: ref.promiseId,
          evidence: [ledger.path, INTENT_JUDGMENTS_PATH],
        });
      }
      const promise = promiseById.get(ref.promiseId);
      if (promise && promise.acceptanceChecks.length === 0) {
        addFinding(findings, {
          severity: "critical",
          category: "absorbed_promise_missing_acceptance_check",
          title: `${ref.promiseId} (intent-absorbed via ${ledger.path}) has no acceptance checks`,
          ledgerPath: ledger.path,
          storyId: ref.promiseId,
          evidence: [promise.path, ledger.path],
        });
      }
    }
  }

  const aspectRows = [];
  for (const aspect of aspects) {
    const ledger = aspect.coveringLedger ? ledgerByPath.get(aspect.coveringLedger) : null;
    const aspectIds = [aspect.id, ...aspect.legacyIds];
    const matchingEntries =
      ledger?.sufficiencyEntries.filter((entry) =>
        aspectIds.some((id) => entry.block.includes(id)),
      ) ?? [];
    const latestEntry = matchingEntries.at(-1) ?? null;

    if (!ledger || !latestEntry) {
      addFinding(findings, {
        severity: "critical",
        category: "pol_aspect_unverified",
        title: `${aspect.id} aspect has no verdict-bearing Sufficiency Review entry`,
        storyId: aspect.id,
        ledgerPath: aspect.coveringLedger || undefined,
        evidence: [aspect.path, aspect.coveringLedger].filter(Boolean),
      });
      aspectRows.push({ ...aspect, status: "unverified" });
      continue;
    }
    if (latestEntry.verdict === "not-met") {
      addFinding(findings, {
        severity: "critical",
        category: "pol_aspect_not_met",
        title: `${aspect.id} aspect verdict is not-met`,
        storyId: aspect.id,
        ledgerPath: ledger.path,
        evidence: [aspect.path, ledger.path],
      });
      aspectRows.push({ ...aspect, status: "not-met" });
      continue;
    }
    if (latestEntry.verdict !== "met") {
      addFinding(findings, {
        severity: "critical",
        category: "pol_aspect_unknown",
        title: `${aspect.id} aspect verdict is unknown`,
        storyId: aspect.id,
        ledgerPath: ledger.path,
        evidence: [aspect.path, ledger.path],
      });
      aspectRows.push({ ...aspect, status: "unknown" });
      continue;
    }
    aspectRows.push({ ...aspect, status: "met" });
  }

  return {
    skipped,
    summary: {
      experienceCount: experiences.length,
      momentCount: moments.length,
      promiseCount: promises.length,
      aspectCount: aspects.length,
      ledgerCount: ledgers.length,
      ledgerRowCount: ledgerRows.length,
      intentEntries: ledgers.reduce(
        (count, ledger) =>
          count +
          ledger.sufficiencyEntries.filter(
            (entry) =>
              !aspects.some((aspect) =>
                [aspect.id, ...aspect.legacyIds].some((id) => entry.block.includes(id)),
              ),
          ).length,
        0,
      ),
      intentMet: ledgers.reduce(
        (count, ledger) =>
          count +
          ledger.sufficiencyEntries.filter(
            (entry) =>
              entry.verdict === "met" &&
              !aspects.some((aspect) =>
                [aspect.id, ...aspect.legacyIds].some((id) => entry.block.includes(id)),
              ),
          ).length,
        0,
      ),
      aspectMet: aspectRows.filter((row) => row.status === "met").length,
      assuranceClaimCount: assuranceClaims.length,
      lifecycleCount: lifecycles.length,
      controlCount: controls.length,
      evidenceKindCount: evidenceKinds.size,
    },
    findings,
  };
}

function statusFor(findings, categories) {
  const scoped = findings.filter((finding) => categories.has(finding.category));
  if (scoped.some((finding) => finding.severity === "critical")) return "blocked";
  if (scoped.length > 0) return "warning";
  return "green";
}

function detailFor(findings, categories) {
  const scoped = findings.filter((finding) => categories.has(finding.category));
  if (scoped.length === 0) return "clean";
  const critical = scoped.filter((finding) => finding.severity === "critical").length;
  const warning = scoped.length - critical;
  return `${critical} critical, ${warning} warning`;
}

function formatReleaseVerdict(snapshot) {
  const { findings, skipped, summary } = snapshot;
  const intentStatus = statusFor(findings, INTENT_CATEGORIES);
  const acStatus = statusFor(findings, LONGITUDINAL_AC_CATEGORIES);
  const codeStatus = statusFor(findings, CODE_TRACE_CATEGORIES);
  const aspectStatus = statusFor(findings, ASPECT_CATEGORIES);
  const structureStatus = statusFor(findings, STRUCTURE_CATEGORIES);
  const engineeringStatus = statusFor(findings, ENGINEERING_CATEGORIES);
  const criticalCount = findings.filter((finding) => finding.severity === "critical").length;
  const release = criticalCount === 0 ? "ready" : "blocked";
  const releaseSuffix = skipped ? " (skeleton)" : "";

  return [
    "Release verdict",
    `  Structure:      ${structureStatus.padEnd(12)} (${detailFor(findings, STRUCTURE_CATEGORIES)})`,
    `  Intent verdict: ${intentStatus.padEnd(12)} (${summary.intentMet}/${summary.intentEntries} met)`,
    `  AC trace:       ${acStatus.padEnd(12)} (${detailFor(findings, LONGITUDINAL_AC_CATEGORIES)})`,
    `  Code trace:     ${codeStatus.padEnd(12)} (${detailFor(findings, CODE_TRACE_CATEGORIES)})`,
    `  Aspect:         ${aspectStatus.padEnd(12)} (${summary.aspectMet}/${summary.aspectCount} met)`,
    `  Engineering:    ${engineeringStatus.padEnd(12)} (${summary.assuranceClaimCount ?? 0} claims, ${summary.lifecycleCount ?? 0} lifecycles, ${summary.controlCount ?? 0} controls)`,
    `Release: ${release}${releaseSuffix}`,
  ].join("\n");
}

function getStagedFiles() {
  const result = spawnSync("git", ["diff", "--cached", "--name-only"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) return [];
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function affectsStoryChain(files) {
  return files.some((file) =>
    STAGED_TRIGGERS.some((trigger) =>
      trigger.endsWith("/") ? file.startsWith(trigger) : file === trigger,
    ),
  );
}

function main() {
  const args = process.argv.slice(2);
  const wantsJson = args.includes("--json");
  const stagedOnly = args.includes("--staged");
  const requireNonEmpty = args.includes("--require-non-empty");

  if (stagedOnly && !affectsStoryChain(getStagedFiles())) {
    if (wantsJson) {
      process.stdout.write(
        `${JSON.stringify({ skipped: true, reason: "no-story-chain-staged", findings: [] })}\n`,
      );
    } else {
      process.stdout.write(
        "mc:validate-story-chain - no staged files affect Story Chain. skipping.\n",
      );
    }
    return;
  }

  const snapshot = buildSnapshot();
  if (requireNonEmpty && snapshot.skipped) {
    addFinding(snapshot.findings, {
      severity: "critical",
      category: "empty_story_chain",
      title:
        "Story Chain is empty — bootstrap/release requires at least one approved Experience, Moment, Promise, and Evidence Ledger",
      evidence: ["docs/contracts/story-chain/"],
    });
  }
  if (wantsJson) {
    process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
    return;
  }

  if (snapshot.skipped && snapshot.findings.length === 0) {
    process.stdout.write("mc:validate-story-chain - 0 findings, skipped\n");
  } else {
    const criticalCount = snapshot.findings.filter(
      (finding) => finding.severity === "critical",
    ).length;
    process.stdout.write(
      `mc:validate-story-chain - ${snapshot.findings.length} finding(s), ${criticalCount} critical\n`,
    );
  }
  process.stdout.write(`${formatReleaseVerdict(snapshot)}\n`);

  if (snapshot.findings.length > 0) {
    process.stdout.write("\nFindings\n");
    for (const finding of snapshot.findings) {
      process.stdout.write(`  [${finding.severity}] ${finding.category}: ${finding.title}\n`);
    }
  }

  if (snapshot.findings.some((finding) => finding.severity === "critical")) {
    process.exitCode = 1;
  }
}

main();
