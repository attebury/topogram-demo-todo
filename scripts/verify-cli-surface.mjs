import assert from "node:assert/strict";
import childProcess from "node:child_process";

const help = childProcess.spawnSync("topogram", ["--help"], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(help.status, 0, help.stderr || help.stdout);
assert.match(help.stdout, /topogram catalog show todo/);
assert.match(help.stdout, /topogram source status/);

console.log("Topogram CLI exposes catalog show and source status.");
