import assert from "node:assert/strict";
import childProcess from "node:child_process";

const result = childProcess.spawnSync(
  "topogram",
  ["template", "show", "todo", "--json", "--catalog", "./topograms.catalog.json"],
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
assert.equal(payload.source, "catalog");
assert.equal(payload.template.id, "todo");
assert.equal(payload.template.kind, "template");
assert.equal(payload.packageSpec, "@attebury/topogram-template-todo@0.1.6");
assert.equal(
  payload.commands.primary,
  "topogram new ./my-app --template todo --catalog ./topograms.catalog.json"
);

console.log("Catalog template show describes todo.");
