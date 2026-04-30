import assert from "node:assert/strict";
import childProcess from "node:child_process";

const result = childProcess.spawnSync("topogram", ["source", "status", "--json"], {
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
assert.equal(payload.project.catalog.packageSpec, "@attebury/topogram-template-todo@0.1.6");
assert.equal(payload.project.template.id, "@attebury/topogram-template-todo");
assert.equal(payload.project.template.source, "package");
assert.equal(payload.project.template.sourceSpec, "@attebury/topogram-template-todo@0.1.6");
assert.equal(payload.project.package.package, "@attebury/topogram-template-todo");
assert.equal(payload.project.package.currentVersion, "0.1.6");
assert.equal(payload.project.trust.status, "trusted");
assert.equal(payload.project.templateOwnedBaseline.exists, true);
assert.equal(payload.project.templateOwnedBaseline.trustedFiles > 0, true);
assert.equal(payload.project.templateOwnedBaseline.status, "changed");
assert.equal(payload.project.templateOwnedBaseline.state, "diverged");
assert.equal(payload.project.templateOwnedBaseline.meaning, "local-project-owns-changes");
assert.equal(payload.project.templateOwnedBaseline.localOwnership, true);
assert.equal(payload.project.templateOwnedBaseline.changedAllowed, true);
assert.equal(payload.project.templateOwnedBaseline.blocksCheck, false);
assert.equal(payload.project.templateOwnedBaseline.blocksGenerate, false);
assert.deepEqual(payload.project.templateBaseline, payload.project.templateOwnedBaseline);
assert.equal(Array.isArray(payload.project.templateOwnedBaseline.content.changed), true);
assert.equal(Array.isArray(payload.project.templateOwnedBaseline.content.added), true);
assert.equal(Array.isArray(payload.project.templateOwnedBaseline.content.removed), true);
assert.deepEqual(payload.project.templateOwnedBaseline.content.changed, ["topogram.project.json"]);

console.log("Source status reports catalog, template, package, trust, and local-owned baseline divergence.");
