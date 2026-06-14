#!/usr/bin/env node

/**
 * Smoke harness for mc-add-promise scaffold behavior.
 *
 *   node scripts/mission-control/__tests__/mc-add-promise-smoke.mjs --case ac2
 *   node scripts/mission-control/__tests__/mc-add-promise-smoke.mjs --case ac3
 *
 * 임시 promise를 만들어 검증한 뒤 정리한다. 실패 시 비-제로 exit + stderr.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const EXPERIENCES_DIR = join(REPO_ROOT, "docs/contracts/story-chain/experiences");
const MOMENTS_DIR = join(REPO_ROOT, "docs/contracts/story-chain/moments");
const PROMISES_DIR = join(REPO_ROOT, "docs/contracts/story-chain/promises");
const ADD_SCRIPT = join(REPO_ROOT, "scripts/mission-control/mc-add-promise.mjs");
const VALIDATE_SCRIPT = join(REPO_ROOT, "scripts/mission-control/mc-validate-story-chain.mjs");

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      options[argv[i].slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return options;
}

function fail(message) {
  process.stderr.write(`smoke FAIL: ${message}\n`);
  process.exit(1);
}

function makeTempSlug() {
  return `smoke-${process.pid}-${Date.now()}`;
}

function seedStructure(slug) {
  writeFileSync(
    join(EXPERIENCES_DIR, `${slug}.md`),
    `---\nid: experience:${slug}\nslug: ${slug}\ntitle: Smoke experience\nscope: core-product\n---\n\n# Smoke experience\n\nTemporary structure for mc-add-promise smoke tests.\n`,
  );
  writeFileSync(
    join(MOMENTS_DIR, `${slug}.md`),
    `---\nid: moment:${slug}\nslug: ${slug}\ntitle: Smoke moment\nexperience: experience:${slug}\n---\n\n# Smoke moment\n\nTemporary structure for mc-add-promise smoke tests.\n`,
  );
}

function runAddPromise(slug) {
  seedStructure(slug);
  const result = spawnSync(
    "node",
    [
      ADD_SCRIPT,
      slug,
      "--title",
      "Smoke test",
      "--experience",
      `experience:${slug}`,
      "--moment",
      `moment:${slug}`,
      "--lane",
      "other",
    ],
    { encoding: "utf8" },
  );
  return result;
}

function cleanup(slug) {
  for (const path of [
    join(PROMISES_DIR, `${slug}.md`),
    join(MOMENTS_DIR, `${slug}.md`),
    join(EXPERIENCES_DIR, `${slug}.md`),
  ]) {
    if (existsSync(path)) unlinkSync(path);
  }
}

function ac2(slug) {
  const addResult = runAddPromise(slug);
  if (addResult.status !== 0) {
    cleanup(slug);
    fail(`mc-add-promise exited ${addResult.status}: ${addResult.stderr}`);
  }
  const path = join(PROMISES_DIR, `${slug}.md`);
  if (!existsSync(path)) {
    fail(`Expected ${path} to exist`);
  }
  const content = readFileSync(path, "utf8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    cleanup(slug);
    fail("Generated file has no frontmatter");
  }
  const fm = YAML.parse(fmMatch[1]);
  const expectations = {
    id: `promise:${slug}`,
    title: "Smoke test",
    experience: `experience:${slug}`,
    moment: `moment:${slug}`,
    lane: "other",
  };
  for (const [key, expected] of Object.entries(expectations)) {
    if (fm[key] !== expected) {
      cleanup(slug);
      fail(`frontmatter ${key} mismatch: expected ${expected}, got ${fm[key]}`);
    }
  }
  // 본문 placeholder 보존 검사 (H authority 영역)
  if (!content.includes("As a ...") || !content.includes("I want ...")) {
    cleanup(slug);
    fail("Body placeholder was overwritten — _TEMPLATE.md drift?");
  }
  cleanup(slug);
  process.stdout.write(`smoke PASS ac2 — ${slug}\n`);
}

function ac3(slug) {
  const addResult = runAddPromise(slug);
  if (addResult.status !== 0) {
    cleanup(slug);
    fail(`mc-add-promise exited ${addResult.status}: ${addResult.stderr}`);
  }
  const validateResult = spawnSync("node", [VALIDATE_SCRIPT], { encoding: "utf8" });
  cleanup(slug);
  if (validateResult.status !== 1) {
    fail(`expected validator exit 1, got ${validateResult.status}`);
  }
  const stdout = validateResult.stdout ?? "";
  // A freshly-added Promise that hasn't been propagated must hit the full
  // cardinality stack: it has no Evidence Ledger citation, no
  // check:evidence-coverage row, and no entry in the feature-specs.md ledger.
  // Asserting all three keeps the test honest about what release-blocking the
  // bare scaffold triggers — no single category fires alone.
  const expected = [
    `missing_ac_ledger: promise:${slug}`,
    `promise_no_ledger_citation: promise:${slug}`,
    `acceptance_check_no_evidence_row: promise:${slug}`,
  ];
  for (const line of expected) {
    if (!stdout.includes(line)) {
      fail(`expected stdout to contain "${line}"; got:\n${stdout}`);
    }
  }
  process.stdout.write(`smoke PASS ac3 — ${slug}\n`);
}

function main() {
  const { case: caseName } = parseArgs(process.argv.slice(2));
  const slug = makeTempSlug();
  if (caseName === "ac2") ac2(slug);
  else if (caseName === "ac3") ac3(slug);
  else fail(`Unknown --case ${caseName}; expected ac2 or ac3`);
}

main();
