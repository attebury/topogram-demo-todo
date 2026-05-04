import assert from "node:assert/strict";
import childProcess from "node:child_process";

const topogramBin = process.env.TOPOGRAM_BIN || "topogram";
const result = childProcess.spawnSync(topogramBin, [
  "query",
  "component-behavior",
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

assert.equal(report.type, "component_behavior_report");
assert.equal(report.filters.projection, "proj_ui_web");
assert.equal(report.summary.errors, 0);
assert.equal(report.summary.warnings, 0);
assert.equal(report.summary.total_usages, 4);
assert.equal(report.summary.total_behaviors, 12);
assert.equal(report.summary.realized, 12);
assert.equal(report.summary.partial, 0);
assert.deepEqual(report.summary.affected_components, [
  "component_ui_task_board",
  "component_ui_task_calendar",
  "component_ui_task_summary",
  "component_ui_task_table"
]);
assert.deepEqual(report.summary.affected_capabilities, [
  "cap_export_tasks",
  "cap_list_tasks",
  "cap_update_task"
]);
assert.deepEqual(report.groups.screens.map((group) => group.id), [
  "task_board",
  "task_calendar",
  "task_list"
]);
assert.deepEqual(report.groups.effects.map((group) => group.id), [
  "command",
  "navigation",
  "none"
]);
assert.equal(report.highlights.length, 0);

console.log("Todo component behavior query passes for proj_ui_web.");
