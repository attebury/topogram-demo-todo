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

if (process.env.TOPOGRAM_FAKE_TEMPLATE_PACKAGE_ROOT) {
  env.PATH = `${createFakeNpm(root, process.env.TOPOGRAM_FAKE_TEMPLATE_PACKAGE_ROOT)}${path.delimiter}${env.PATH}`;
}

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
assert.match(result.stdout, /Source: package/);
assert.match(result.stdout, /Source spec: @attebury\/topogram-template-todo@0\.1\.6/);
assert.match(result.stdout, /Catalog: todo from \.\/topograms\.catalog\.json/);
assert.match(result.stdout, /Package: @attebury\/topogram-template-todo@0\.1\.6/);
assert.match(result.stdout, /Executable implementation: yes/);
assert.match(result.stdout, /Policy: topogram\.template-policy\.json/);
assert.match(result.stdout, /Template files: \.topogram-template-files\.json/);
assert.match(result.stdout, /Trust: \.topogram-template-trust\.json/);
assert.match(result.stdout, /npm run template:policy:explain/);
assert.match(result.stdout, /npm run trust:status/);
assert.match(result.stderr, /copied implementation\/ code/);

const projectConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, "topogram.project.json"), "utf8"));
assert.equal(projectConfig.template.requested, "todo");
assert.equal(projectConfig.template.catalog.packageSpec, "@attebury/topogram-template-todo@0.1.6");
assert.equal(fs.existsSync(path.join(projectRoot, ".topogram-template-trust.json")), true);
assert.equal(fs.existsSync(path.join(projectRoot, "topogram.template-policy.json")), true);
assert.equal(fs.existsSync(path.join(projectRoot, "implementation", "index.js")), true);

console.log("Template creation guidance describes catalog provenance and trust steps.");

function createFakeNpm(rootDir, templatePackageRoot) {
  const binDir = path.join(rootDir, "bin");
  fs.mkdirSync(binDir, { recursive: true });
  const npmPath = path.join(binDir, "npm");
  fs.writeFileSync(npmPath, `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const args = process.argv.slice(2);
function packageNameFromSpec(spec) {
  if (spec.startsWith("@")) {
    const [scope, rest] = spec.split("/");
    const versionIndex = rest.indexOf("@");
    return path.join(scope, versionIndex >= 0 ? rest.slice(0, versionIndex) : rest);
  }
  const versionIndex = spec.indexOf("@");
  return versionIndex >= 0 ? spec.slice(0, versionIndex) : spec;
}
if (args[0] !== "install") {
  process.stderr.write("Unexpected fake npm command: " + args.join(" ") + "\\n");
  process.exit(1);
}
const prefixIndex = args.indexOf("--prefix");
if (prefixIndex < 0) {
  process.stderr.write("Fake npm only supports template package install with --prefix.\\n");
  process.exit(1);
}
const prefix = args[prefixIndex + 1];
const spec = args[args.length - 1];
const target = path.join(prefix, "node_modules", packageNameFromSpec(spec));
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(${JSON.stringify(templatePackageRoot)}, target, { recursive: true });
process.exit(0);
`, "utf8");
  fs.chmodSync(npmPath, 0o755);
  return binDir;
}
