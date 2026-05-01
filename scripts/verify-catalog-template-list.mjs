import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";

const result = childProcess.spawnSync(
  topogramBin,
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
assert.equal(todo.defaultVersion, "0.1.10");
assert.equal(todo.includesExecutableImplementation, true);

const humanList = childProcess.spawnSync(
  topogramBin,
  ["template", "list", "--catalog", "./topograms.catalog.json"],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: process.env.PATH || ""
    }
  }
);

assert.equal(humanList.status, 0, humanList.stderr || humanList.stdout);
assert.match(humanList.stdout, /Template starters:/);
assert.match(humanList.stdout, /Catalog aliases resolve to versioned package installs/);
assert.match(humanList.stdout, /todo@0\.1\.10/);
assert.match(humanList.stdout, /Source: catalog \| Surfaces: web, api, database \| Stack: SvelteKit \+ Hono \+ Postgres \| Executable implementation: yes/);
assert.match(humanList.stdout, /topogram new \.\/my-app --template todo/);

console.log("Catalog template list includes todo.");

const show = childProcess.spawnSync(
  topogramBin,
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
assert.equal(showPayload.packageSpec, "@attebury/topogram-template-todo@0.1.10");
assert.equal(
  showPayload.commands.primary,
  "topogram new ./my-app --template todo --catalog ./topograms.catalog.json"
);

console.log("Catalog show recommends todo template creation.");
