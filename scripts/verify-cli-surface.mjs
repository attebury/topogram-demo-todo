import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";

const help = childProcess.spawnSync(topogramBin, ["--help"], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(help.status, 0, help.stderr || help.stdout);
assert.match(help.stdout, /topogram catalog show todo/);
assert.match(help.stdout, /topogram source status/);
assert.match(help.stdout, /topogram template list/);

console.log("Topogram CLI exposes catalog, template, and source commands.");
