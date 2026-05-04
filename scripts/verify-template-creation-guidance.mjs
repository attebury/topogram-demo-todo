import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "topogram-demo-template-guidance-"));
const projectRoot = path.join(root, "todo-from-template");
const topogramBin = process.env.TOPOGRAM_BIN || "topogram";
const env = {
  ...process.env,
  PATH: process.env.PATH || ""
};

const result = childProcess.spawnSync(
  topogramBin,
  ["new", projectRoot, "--template", "todo", "--catalog", "./topograms.catalog.json"],
  {
    encoding: "utf8",
    env
  }
);

assert.equal(result.status, 0, result.stderr || result.stdout);
assert.match(result.stdout, /Created Topogram project/);
assert.match(result.stdout, /Template: @attebury\/topogram-template-todo/);
assert.match(result.stderr, /copied implementation\/ code/);

const projectConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, "topogram.project.json"), "utf8"));
assert.equal(projectConfig.template.requested, "todo");
assert.equal(projectConfig.template.catalog.packageSpec, "@attebury/topogram-template-todo@0.1.29");
assert.equal(fs.existsSync(path.join(projectRoot, ".topogram-template-trust.json")), true);
assert.equal(fs.existsSync(path.join(projectRoot, "topogram.template-policy.json")), true);
assert.equal(fs.existsSync(path.join(projectRoot, "implementation", "index.js")), true);

console.log("Template creation guidance describes catalog provenance and trust steps.");
