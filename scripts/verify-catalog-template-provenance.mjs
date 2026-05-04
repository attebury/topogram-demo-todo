import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "topogram-catalog-provenance-"));
const projectRoot = path.join(runRoot, "todo-from-catalog");

try {
  const result = childProcess.spawnSync(
    "topogram",
    ["new", projectRoot, "--template", "todo", "--catalog", "./topograms.catalog.json"],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: process.env.PATH || ""
      }
    }
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const projectConfig = readJson(path.join(projectRoot, "topogram.project.json"));
  const fileManifest = readJson(path.join(projectRoot, ".topogram-template-files.json"));
  const trustRecord = readJson(path.join(projectRoot, ".topogram-template-trust.json"));
  const expectedCatalog = {
    id: "todo",
    source: "./topograms.catalog.json",
    package: "@attebury/topogram-template-todo",
    version: "0.1.13",
    packageSpec: "@attebury/topogram-template-todo@0.1.13"
  };

  assert.equal(projectConfig.template.id, "@attebury/topogram-template-todo");
  assert.equal(projectConfig.template.source, "package");
  assert.equal(projectConfig.template.requested, "todo");
  assert.equal(projectConfig.template.sourceSpec, "@attebury/topogram-template-todo@0.1.13");
  assert.deepEqual(projectConfig.template.catalog, expectedCatalog);
  assert.deepEqual(fileManifest.template.catalog, expectedCatalog);
  assert.deepEqual(trustRecord.template.catalog, expectedCatalog);

  console.log("Catalog-created project records template provenance.");
} finally {
  fs.rmSync(runRoot, { recursive: true, force: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
