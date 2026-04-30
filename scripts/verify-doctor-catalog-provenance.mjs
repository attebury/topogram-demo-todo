import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";

const result = childProcess.spawnSync(topogramBin, ["doctor", "--json"], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(result.status, 0, result.stderr || result.stdout);
const payload = JSON.parse(result.stdout);
assert.equal(payload.ok, true);
assert.equal(payload.catalog.source, "./topograms.catalog.json");
assert.equal(payload.catalog.catalog.reachable, true);
assert.equal(payload.catalog.catalog.entries, 1);
const todo = payload.catalog.packages.find((item) => item.id === "todo");
assert.ok(todo, "expected doctor to check catalog-provenance todo package");
assert.equal(todo.packageSpec, "@attebury/topogram-template-todo@0.1.6");
assert.equal(todo.ok, true);
assert.equal(
  payload.diagnostics.some((diagnostic) => diagnostic.code === "catalog_check_skipped"),
  false
);

console.log("Doctor verifies recorded catalog provenance.");
