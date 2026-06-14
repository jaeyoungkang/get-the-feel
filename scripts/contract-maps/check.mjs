import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MAP_DIR = path.join(ROOT, "docs/contract-maps");
const README = path.join(MAP_DIR, "README.md");

function fail(message) {
  console.error(`contract-maps: ${message}`);
  process.exit(1);
}

function markdownFiles() {
  if (!existsSync(MAP_DIR)) fail("docs/contract-maps does not exist");
  return readdirSync(MAP_DIR)
    .filter((entry) => entry.endsWith(".md"))
    .sort()
    .map((entry) => path.join(MAP_DIR, entry));
}

function relativeToRoot(file) {
  return path.relative(ROOT, file);
}

function checkLinks(files) {
  const missing = [];
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const dir = path.dirname(file);
    for (const match of source.matchAll(linkPattern)) {
      const raw = match[1].trim();
      if (!raw) continue;
      if (/^(https?:|mailto:|#)/.test(raw)) continue;
      const [target] = raw.split("#");
      if (!target) continue;
      const decoded = decodeURIComponent(target);
      const resolved = path.resolve(dir, decoded);
      if (!existsSync(resolved)) {
        missing.push(`${relativeToRoot(file)} -> ${raw}`);
      }
    }
  }
  return missing;
}

function checkReadmeIndex(files) {
  if (!existsSync(README)) fail("README.md is missing");
  const readme = readFileSync(README, "utf8");
  const missing = [];
  for (const file of files) {
    const name = path.basename(file);
    if (name === "README.md") continue;
    if (!readme.includes(`(${name})`)) {
      missing.push(name);
    }
  }
  return missing;
}

const files = markdownFiles();
const missingLinks = checkLinks(files);
const missingReadmeEntries = checkReadmeIndex(files);

if (missingLinks.length > 0 || missingReadmeEntries.length > 0) {
  if (missingLinks.length > 0) {
    console.error("Missing local links:");
    for (const item of missingLinks) console.error(`- ${item}`);
  }
  if (missingReadmeEntries.length > 0) {
    console.error("README Current Maps is missing:");
    for (const item of missingReadmeEntries) console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`contract-maps: ${files.length.toString()} markdown files checked`);
