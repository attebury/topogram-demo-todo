import assert from "node:assert/strict";
import childProcess from "node:child_process";

const mode = process.argv.includes("--remote") ? "remote" : "local";
const args = ["source", "status", "--json"];
if (mode === "local") {
  args.push("--local");
}
const result = childProcess.spawnSync("topogram", args, {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(result.status, 0, result.stderr || result.stdout);
const payload = JSON.parse(result.stdout);

assert.equal(payload.project.catalog.id, "todo");
assert.equal(payload.project.catalog.package, "@attebury/topogram-template-todo");
assert.equal(payload.project.catalog.packageSpec, "@attebury/topogram-template-todo@0.1.27");
assert.equal(payload.project.template.id, "@attebury/topogram-template-todo");
assert.equal(payload.project.template.source, "package");
assert.equal(payload.project.template.sourceSpec, "@attebury/topogram-template-todo@0.1.27");
assert.equal(payload.project.package.package, "@attebury/topogram-template-todo");
assert.equal(payload.project.package.packageSpec, "@attebury/topogram-template-todo@0.1.27");
if (mode === "remote") {
  assert.equal(payload.project.package.currentVersion, "0.1.27");
  assert.equal(payload.project.packageChecks.mode, "remote");
  assert.equal(payload.project.packageChecks.skipped, false);
} else {
  assert.equal(payload.project.package.checked, false);
  assert.equal(payload.project.package.currentVersion, null);
  assert.equal(payload.project.package.latestVersion, null);
  assert.equal(payload.project.packageChecks.mode, "local");
  assert.equal(payload.project.packageChecks.skipped, true);
}
assert.equal(payload.project.trust.status, "trusted");
assert.equal(payload.project.templateOwnedBaseline, undefined);
assert.equal(payload.project.templateBaseline.exists, true);
assert.equal(payload.project.templateBaseline.trustedFiles > 0, true);
assert.equal(payload.project.templateBaseline.status, "clean");
assert.equal(payload.project.templateBaseline.state, "matches-template");
assert.equal(payload.project.templateBaseline.meaning, "matches-template-baseline");
assert.equal(payload.project.templateBaseline.localOwnership, false);
assert.equal(payload.project.templateBaseline.changedAllowed, true);
assert.equal(payload.project.templateBaseline.blocksCheck, false);
assert.equal(payload.project.templateBaseline.blocksGenerate, false);
assert.equal(Array.isArray(payload.project.templateBaseline.content.changed), true);
assert.equal(Array.isArray(payload.project.templateBaseline.content.added), true);
assert.equal(Array.isArray(payload.project.templateBaseline.content.removed), true);
assert.deepEqual(payload.project.templateBaseline.content.changed, []);
assert.deepEqual(payload.project.templateBaseline.content.added, []);
assert.deepEqual(payload.project.templateBaseline.content.removed, []);

console.log(`Source status ${mode} mode reports catalog, template, package, trust, and clean template baseline.`);
