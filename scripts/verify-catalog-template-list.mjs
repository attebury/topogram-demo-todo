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

const show = childProcess.spawnSync(
  "topogram",
  ["catalog", "show", "todo", "--catalog", "./topograms.catalog.json", "--json"],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: process.env.PATH || ""
    }
  }
);

assert.equal(show.status, 0, show.stderr || show.stdout);
const showPayload = JSON.parse(show.stdout);
assert.equal(showPayload.entry.kind, "template");
assert.equal(showPayload.packageSpec, "@attebury/topogram-template-todo@0.1.2");
assert.equal(
  showPayload.commands.primary,
  "topogram new ./my-app --template todo --catalog ./topograms.catalog.json"
);

console.log("Catalog show recommends todo template creation.");
