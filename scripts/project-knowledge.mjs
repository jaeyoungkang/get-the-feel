#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const localRoot = path.join(repoRoot, ".project-knowledge-local");
const memoryPath = path.join(localRoot, "work-memory.md");
const logPath = path.join(localRoot, "work-memory-log.jsonl");
const eventPath = path.join(repoRoot, "docs/project-events/bootstrap-events.jsonl");
const changeLogPath = path.join(repoRoot, "docs/change-log.md");

function usage() {
  console.log(`Usage:
  node scripts/project-knowledge.mjs start
  node scripts/project-knowledge.mjs remember --note "<note>"
  node scripts/project-knowledge.mjs log
  node scripts/project-knowledge.mjs event --type <type> --summary "<summary>" [--details-json '{}']
  node scripts/project-knowledge.mjs validate`);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? "";
}

function nowIso() {
  return new Date().toISOString();
}

async function ensureDirs() {
  await mkdir(localRoot, { recursive: true });
  await mkdir(path.dirname(eventPath), { recursive: true });
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function start() {
  await ensureDirs();
  if (!(await exists(memoryPath))) {
    await writeFile(
      memoryPath,
      "# Work Memory\n\n아직 기록된 작업 기억이 없다.\n",
      "utf8",
    );
  }
  const memory = await readFile(memoryPath, "utf8");
  console.log("project-knowledge-start");
  console.log(memory.trim());
}

async function remember() {
  const note = getArg("--note");
  if (!note || note.trim().length < 8) {
    throw new Error("--note requires a concrete narrative");
  }
  await ensureDirs();
  const record = {
    timestamp: nowIso(),
    type: "work-memory",
    note: note.trim(),
  };
  await appendFile(logPath, `${JSON.stringify(record)}\n`, "utf8");
  await writeFile(
    memoryPath,
    `# Work Memory\n\nUpdated: ${record.timestamp}\n\n${record.note}\n`,
    "utf8",
  );
  console.log(`remembered: ${record.timestamp}`);
}

async function log() {
  if (!(await exists(logPath))) {
    console.log("No local work-memory log yet.");
    return;
  }
  const content = await readFile(logPath, "utf8");
  for (const line of content.split("\n").filter(Boolean)) {
    const record = JSON.parse(line);
    console.log(`- ${record.timestamp}: ${record.note}`);
  }
}

async function event() {
  const type = getArg("--type");
  const summary = getArg("--summary");
  const detailsJson = getArg("--details-json") ?? "{}";
  if (!type || !/^[a-z0-9_.:-]+$/.test(type)) {
    throw new Error("--type must be a lowercase event type");
  }
  if (!summary || summary.trim().length < 8) {
    throw new Error("--summary requires a concrete summary");
  }
  let details;
  try {
    details = JSON.parse(detailsJson);
  } catch {
    throw new Error("--details-json must be valid JSON");
  }
  await ensureDirs();
  const record = {
    timestamp: nowIso(),
    type,
    summary: summary.trim(),
    details,
  };
  await appendFile(eventPath, `${JSON.stringify(record)}\n`, "utf8");
  console.log(`event: ${record.type} ${record.timestamp}`);
}

async function validateJsonl(filePath, allowTemplate = false) {
  if (!(await exists(filePath))) return [];
  const errors = [];
  const content = await readFile(filePath, "utf8");
  const lines = content.split("\n").filter(Boolean);
  lines.forEach((line, index) => {
    try {
      const record = JSON.parse(line);
      if (!allowTemplate && record.timestamp === "TEMPLATE") {
        errors.push(`${filePath}:${index + 1} still has TEMPLATE timestamp`);
      }
      if (!record.type) errors.push(`${filePath}:${index + 1} missing type`);
    } catch {
      errors.push(`${filePath}:${index + 1} invalid JSON`);
    }
  });
  return errors;
}

async function validate() {
  const errors = [];
  const isTemplateRepo = await isAgenticBaseTemplate();
  if (!(await exists(changeLogPath))) errors.push("missing docs/change-log.md");
  errors.push(...(await validateJsonl(eventPath, isTemplateRepo)));
  errors.push(...(await validateJsonl(logPath, true)));
  if (!isTemplateRepo) {
    errors.push(...(await validateBootstrapEvents()));
    errors.push(...(await validateChangeLog()));
  }
  if (errors.length > 0) {
    console.error("Project knowledge validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log("Project knowledge validation OK");
}

async function isAgenticBaseTemplate() {
  const packagePath = path.join(repoRoot, "package.json");
  if (!(await exists(packagePath))) return false;
  try {
    const pkg = JSON.parse(await readFile(packagePath, "utf8"));
    return pkg.name === "agentic-base";
  } catch {
    return false;
  }
}

async function readJsonl(filePath) {
  if (!(await exists(filePath))) return [];
  const content = await readFile(filePath, "utf8");
  return content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function validateBootstrapEvents() {
  const errors = [];
  const events = await readJsonl(eventPath);
  const types = new Set(events.map((eventRecord) => eventRecord.type));
  for (const required of [
    "project.initialized",
    "project.approved_source_imported",
    "project.skill_suite_available",
  ]) {
    if (!types.has(required)) errors.push(`missing bootstrap event: ${required}`);
  }
  return errors;
}

async function validateChangeLog() {
  if (!(await exists(changeLogPath))) return ["missing docs/change-log.md"];
  const content = await readFile(changeLogPath, "utf8");
  if (!content.includes("bootstrap:")) {
    return ["docs/change-log.md has no bootstrap entry"];
  }
  return [];
}

const command = process.argv[2];
try {
  if (command === "start") await start();
  else if (command === "remember") await remember();
  else if (command === "log") await log();
  else if (command === "event") await event();
  else if (command === "validate") await validate();
  else {
    usage();
    process.exit(command ? 1 : 0);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
