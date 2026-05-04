import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";

const version = childProcess.spawnSync(topogramBin, ["version", "--json"], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(version.status, 0, version.stderr || version.stdout);
const versionPayload = JSON.parse(version.stdout);
assert.equal(versionPayload.packageName, "@attebury/topogram");
assert.equal(typeof versionPayload.executablePath, "string");
assert.equal(typeof versionPayload.nodeVersion, "string");
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const lockedCliVersion = lock.packages?.["node_modules/@attebury/topogram"]?.version;
if (lockedCliVersion) {
  assert.equal(versionPayload.version, lockedCliVersion);
}
console.log(`Topogram CLI ${versionPayload.version} from ${versionPayload.executablePath}`);

const help = childProcess.spawnSync(topogramBin, ["--help"], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(help.status, 0, help.stderr || help.stdout);
assert.match(help.stdout, /topogram version/);
assert.match(help.stdout, /topogram doctor/);
assert.match(help.stdout, /topogram catalog show todo/);
assert.match(help.stdout, /topogram source status/);
assert.match(help.stdout, /topogram template list/);
assert.match(help.stdout, /topogram template explain/);
assert.match(help.stdout, /topogram query list/);
assert.match(help.stdout, /topogram query component-behavior/);

const queryList = childProcess.spawnSync(topogramBin, ["query", "list", "--json"], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(queryList.status, 0, queryList.stderr || queryList.stdout);
const queryListPayload = JSON.parse(queryList.stdout);
assert.equal(queryListPayload.type, "query_list");
assert.equal(queryListPayload.queries.some((query) => query.name === "component-behavior"), true);

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert.equal(pkg.scripts["component:behavior:query"], "node ./scripts/verify-component-behavior-query.mjs");

console.log("Topogram CLI exposes doctor, catalog, template, source, and query commands.");
