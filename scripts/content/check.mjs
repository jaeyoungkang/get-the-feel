#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";

const ROOT = resolve(import.meta.dirname, "../..");
const CONTENT_DIR = join(ROOT, "assets", "content");
const SOURCES_PATH = join(CONTENT_DIR, "sources.md");
const LEGACY_DATA_PATH = join(ROOT, "public", "legacy", "c4-3", "data.js");
const ALLOWED_TYPES = new Set(["sense-choice", "verb-choice", "sense-cloze", "compose-choice"]);

const groups = [];

function group(name) {
  const entry = { name, pass: true, lines: [] };
  groups.push(entry);
  return {
    ok(message) {
      entry.lines.push(`    ok   ${message}`);
    },
    fail(message) {
      entry.pass = false;
      entry.lines.push(`    FAIL ${message}`);
    },
  };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sourceIds() {
  const text = readFileSync(SOURCES_PATH, "utf8");
  return new Set([...text.matchAll(/\|\s*`([^`]+)`\s*\|/g)].map((match) => match[1]));
}

function normalizeSentence(sentence) {
  return String(sentence)
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9가-힣\s'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stable(value[key])]),
  );
}

function loadLegacyData() {
  const context = { window: {} };
  vm.runInNewContext(readFileSync(LEGACY_DATA_PATH, "utf8"), context, {
    filename: LEGACY_DATA_PATH,
  });
  return context.window.CONTENT_ALL;
}

const sourceSet = sourceIds();
const files = readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith(".json"))
  .sort();

const schema = group("content-schema");
const allSentences = new Map();
const assetsBundle = {};

for (const file of files) {
  const content = readJson(join(CONTENT_DIR, file));
  const itemKey = file.replace(/\.json$/, "");
  assetsBundle[itemKey] = content;
  const senseIds = new Set(content.senses?.map((sense) => sense.id));
  if (!content.axis) schema.fail(`${file}: axis missing`);
  if (!content.item) schema.fail(`${file}: item missing`);
  if (!Array.isArray(content.senses) || content.senses.length === 0) {
    schema.fail(`${file}: senses missing`);
    continue;
  }

  schema.ok(`${file}: senses=${content.senses.length}`);

  for (const sense of content.senses) {
    if (!sense.id || !sense.ko || !sense.image) {
      schema.fail(`${file}:${sense.id ?? "unknown"} missing id/ko/image`);
    }
    if (!Array.isArray(sense.source_refs) || sense.source_refs.length === 0) {
      schema.fail(`${file}:${sense.id} source_refs missing`);
    } else {
      for (const ref of sense.source_refs) {
        if (!sourceSet.has(ref.source_id)) {
          schema.fail(`${file}:${sense.id} unknown source_id ${ref.source_id}`);
        }
        if (!ref.locator || !ref.claim) {
          schema.fail(`${file}:${sense.id} source locator/claim missing`);
        }
      }
    }
    if (!sense.validation?.method || !sense.validation?.strength || !sense.validation?.date) {
      schema.fail(`${file}:${sense.id} validation incomplete`);
    } else if (!["strong", "weak"].includes(sense.validation.strength)) {
      schema.fail(`${file}:${sense.id} validation strength invalid`);
    } else if (
      sense.validation.method === "subagent-consensus" &&
      sense.validation.strength !== "weak"
    ) {
      schema.fail(`${file}:${sense.id} subagent-consensus cannot be strong`);
    }
  }

  for (const bucket of ["training_items", "transfer_items"]) {
    if (!Array.isArray(content[bucket]) || content[bucket].length === 0) {
      schema.fail(`${file}: ${bucket} missing`);
      continue;
    }
    if (bucket === "training_items" && content[bucket].length < 8) {
      schema.fail(`${file}: training_items below minimum 8`);
    }
    if (bucket === "transfer_items" && content[bucket].length < 4) {
      schema.fail(`${file}: transfer_items below minimum 4`);
    }
    schema.ok(`${file}: ${bucket}=${content[bucket].length}`);

    for (const item of content[bucket]) {
      if (!senseIds.has(item.sense_id)) {
        schema.fail(`${file}:${item.id} orphan sense_id ${item.sense_id}`);
      }
      for (const key of [
        "id",
        "sentence",
        "sentence_ko",
        "subject_label",
        "object_label",
        "prompt",
        "why_ko",
      ]) {
        if (!item[key]) schema.fail(`${file}:${item.id} ${key} missing`);
      }
      if (!Array.isArray(item.choices) || item.choices.length < 2) {
        schema.fail(`${file}:${item.id} choices missing`);
      }
      if (!Number.isInteger(item.answer_index) || item.answer_index < 0 || item.answer_index >= item.choices.length) {
        schema.fail(`${file}:${item.id} answer_index invalid`);
      }
      const type = item.type || "sense-choice";
      if (!ALLOWED_TYPES.has(type)) {
        schema.fail(`${file}:${item.id} type invalid`);
      }
      if ((type === "verb-choice" || type === "sense-cloze") && !String(item.sentence).includes("___")) {
        schema.fail(`${file}:${item.id} ${type} missing ___ marker`);
      }
      if (itemKey === "phrasal-up" && !item.verb_label) {
        schema.fail(`${file}:${item.id} verb_label missing`);
      }

      const normalized = normalizeSentence(item.sentence);
      const previous = allSentences.get(normalized);
      if (previous) {
        schema.fail(`${file}:${item.id} duplicate sentence with ${previous}`);
      } else {
        allSentences.set(normalized, `${file}:${item.id}`);
      }
    }
  }
}

const legacyData = group("legacy-data-equivalence");
try {
  const legacyBundle = loadLegacyData();
  const assetsStable = JSON.stringify(stable(assetsBundle));
  const legacyStable = JSON.stringify(stable(legacyBundle));
  if (assetsStable !== legacyStable) {
    legacyData.fail("public/legacy/c4-3/data.js differs from assets/content/*.json");
  } else {
    legacyData.ok("public/legacy/c4-3/data.js matches assets/content/*.json");
  }
} catch (error) {
  legacyData.fail(`could not parse public/legacy/c4-3/data.js (${error.message})`);
}

const separation = group("training-transfer-separation");
for (const file of files) {
  const content = readJson(join(CONTENT_DIR, file));
  const training = new Set(content.training_items.map((item) => normalizeSentence(item.sentence)));
  const overlap = content.transfer_items.filter((item) => training.has(normalizeSentence(item.sentence)));
  if (overlap.length > 0) {
    separation.fail(`${file}: transfer duplicates training (${overlap.map((item) => item.id).join(", ")})`);
  } else {
    separation.ok(`${file}: transfer does not duplicate training`);
  }
}

for (const entry of groups) {
  console.log(`\n[${entry.pass ? "PASS" : "FAIL"}] ${entry.name}`);
  for (const line of entry.lines) console.log(line);
}

const failed = groups.some((entry) => !entry.pass);
console.log(`\nRESULT: ${failed ? "FAIL" : "ALL PASS"}`);
process.exit(failed ? 1 : 0);
