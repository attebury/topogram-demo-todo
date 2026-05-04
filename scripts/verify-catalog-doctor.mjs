import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";

const result = childProcess.spawnSync(
  topogramBin,
  ["catalog", "doctor", "--catalog", "./topograms.catalog.json", "--json"],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: process.env.PATH || ""
    }
  }
);

assert.equal(result.status, 0, result.stderr || result.stdout);
const payload = JSON.parse(result.stdout);
assert.equal(payload.ok, true);
assert.equal(payload.catalog.reachable, true);
assert.equal(payload.catalog.entries, 1);
const todo = payload.packages.find((item) => item.id === "todo");
assert.ok(todo, "expected catalog doctor to check todo package");
assert.equal(todo.packageSpec, "@attebury/topogram-template-todo@0.1.26");
assert.equal(todo.ok, true);

console.log("Catalog doctor verifies todo package access.");
