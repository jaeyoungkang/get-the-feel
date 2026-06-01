import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const record = readFileSync(join(root, "assets/CYCLE_RECORD.md"), "utf8");

function field(name) {
  const match = record.match(new RegExp(`^- ${name}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^`|`$/g, "") : "";
}

const sellableStatus = field("sellable_status");
const allowedToStop = field("allowed_to_stop");
const nextAction = field("next_action");

if (sellableStatus !== "pass" || allowedToStop !== "yes") {
  console.error([
    "final permission denied",
    `sellable_status=${sellableStatus || "missing"}`,
    `allowed_to_stop=${allowedToStop || "missing"}`,
    `next_action=${nextAction || "missing"}`,
    "Continue the next fresh candidate before sending a completion-style final response."
  ].join("\n"));
  process.exit(1);
}

console.log("final permission: pass");
