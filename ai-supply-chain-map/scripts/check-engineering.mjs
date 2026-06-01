import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const agenticBaseRepo = "https://github.com/jaeyoungkang/agentic-base.git";

const requiredFiles = [
  "skills/engineering-harness/SKILL.md",
  "assets/engineering-rules.md",
  "assets/engineering-quality-gates.md",
  "package.json"
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`Missing engineering gate files:\n${missing.join("\n")}`);
  process.exit(1);
}

const reads = Object.fromEntries(
  requiredFiles.map((file) => [file, readFileSync(join(root, file), "utf8")])
);

for (const [file, body] of Object.entries(reads)) {
  if (!body.includes(agenticBaseRepo) && file !== "package.json") {
    console.error(`${file} must reference ${agenticBaseRepo}`);
    process.exit(1);
  }
}

const qualityDoc = reads["assets/engineering-quality-gates.md"];
const ladderTerms = [
  "L0",
  "L1",
  "L2",
  "L3",
  "lint",
  "dependency",
  "knip",
  "duplicate",
  "pure-function",
  "coverage",
  "CI"
];

const missingTerms = ladderTerms.filter((term) => !qualityDoc.includes(term));
if (missingTerms.length) {
  console.error(`Engineering quality ladder missing terms:\n${missingTerms.join("\n")}`);
  process.exit(1);
}

const pkg = JSON.parse(reads["package.json"]);
const scripts = pkg.scripts || {};
for (const script of ["quality:assets", "quality:syntax", "quality:engineering", "quality:check"]) {
  if (!scripts[script]) {
    console.error(`package.json missing ${script}`);
    process.exit(1);
  }
}

console.log("engineering gate: pass");
