import { cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const source = new URL("candidates/c4-3/", root);
const target = new URL("public/legacy/c4-3/", root);

await rm(target, { force: true, recursive: true });
await mkdir(target, { recursive: true });
await cp(source, target, {
  recursive: true,
  filter: (path) => !path.endsWith("cycle-record.md"),
});

console.log("Synced candidates/c4-3 to public/legacy/c4-3");
