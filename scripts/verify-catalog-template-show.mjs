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
assert.deepEqual(payload.decision.surfaces, ["web", "api", "database"]);
assert.equal(payload.decision.stack, "SvelteKit + Hono + Postgres");
assert.equal(payload.decision.packageSpec, "@attebury/topogram-template-todo@0.1.6");
assert.equal(payload.decision.executableImplementation, true);
assert.match(payload.decision.policyImpact, /Copies implementation\/ code/);
assert.equal(
  payload.commands.primary,
  "topogram new ./my-app --template todo --catalog ./topograms.catalog.json"
);

const human = childProcess.spawnSync(
  "topogram",
  ["template", "show", "todo", "--catalog", "./topograms.catalog.json"],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: process.env.PATH || ""
    }
  }
);

assert.equal(human.status, 0, human.stderr || human.stdout);
assert.match(human.stdout, /What it creates:/);
assert.match(human.stdout, /Surfaces: web, api, database/);
assert.match(human.stdout, /Stack: SvelteKit \+ Hono \+ Postgres/);
assert.match(human.stdout, /Package: @attebury\/topogram-template-todo@0\.1\.6/);
assert.match(human.stdout, /Policy impact: Copies implementation\/ code/);

console.log("Catalog template show describes todo.");
