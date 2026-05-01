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

console.log("Topogram CLI exposes doctor, catalog, template, and source commands.");
