import assert from "node:assert/strict";
import childProcess from "node:child_process";

const result = childProcess.spawnSync(
  "topogram",
  ["template", "list", "--json", "--catalog", "./topograms.catalog.json"],
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
const todo = payload.templates.find((template) => template.id === "todo");
assert.ok(todo, "expected template list to include catalog template id 'todo'");
assert.equal(todo.source, "catalog");
assert.equal(todo.package, "@attebury/topogram-template-todo");
assert.equal(todo.defaultVersion, "0.1.2");

console.log("Catalog template list includes todo.");
