import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";

const result = childProcess.spawnSync(
  topogramBin,
  ["catalog", "show", "todo", "--json", "--catalog", "./topograms.catalog.json"],
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
assert.equal(payload.source, "./topograms.catalog.json");
assert.equal(payload.entry.id, "todo");
assert.equal(payload.entry.kind, "template");
assert.equal(payload.packageSpec, "@attebury/topogram-template-todo@0.1.9");
assert.equal(payload.entry.trust.includesExecutableImplementation, true);
assert.equal(
  payload.commands.primary,
  "topogram new ./my-app --template todo --catalog ./topograms.catalog.json"
);

const human = childProcess.spawnSync(
  topogramBin,
  ["catalog", "show", "todo", "--catalog", "./topograms.catalog.json"],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: process.env.PATH || ""
    }
  }
);

assert.equal(human.status, 0, human.stderr || human.stdout);
assert.match(human.stdout, /Kind: template/);
assert.match(human.stdout, /Package: @attebury\/topogram-template-todo@0\.1\.9/);
assert.match(human.stdout, /Executable implementation: yes/);
assert.match(human.stdout, /topogram new \.\/my-app --template todo --catalog \.\/topograms\.catalog\.json/);

console.log("Catalog show describes todo.");
