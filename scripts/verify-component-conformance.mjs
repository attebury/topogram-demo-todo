import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";
const result = childProcess.spawnSync(topogramBin, [
  "component",
  "check",
  "./topogram",
  "--projection",
  "proj_ui_web",
  "--json"
], {
  encoding: "utf8",
  env: {
    ...process.env,
    PATH: process.env.PATH || ""
  }
});

assert.equal(result.status, 0, result.stderr || result.stdout);
const report = JSON.parse(result.stdout);

assert.equal(report.type, "component_conformance_report");
assert.equal(report.filters.projection, "proj_ui_web");
assert.equal(report.summary.errors, 0);
assert.equal(report.summary.total_usages, 4);
assert.deepEqual(report.summary.affected_components, [
  "component_ui_task_board",
  "component_ui_task_calendar",
  "component_ui_task_summary",
  "component_ui_task_table"
]);
assert.deepEqual(report.summary.affected_projections, ["proj_ui_shared", "proj_ui_web"]);
assert.equal(report.projection_usages.every((usage) => usage.source_projection?.id === "proj_ui_shared"), true);

console.log("Todo component conformance report passes for proj_ui_web.");
