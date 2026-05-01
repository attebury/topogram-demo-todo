import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const routePath = path.resolve("app/apps/web/app_sveltekit/src/routes/tasks/+page.svelte");
const source = fs.readFileSync(routePath, "utf8");

assert.match(source, /data-topogram-component="component_ui_task_summary"/);
assert.match(source, /data-topogram-component="component_ui_task_table"/);
assert.match(source, /class="component-card component-summary"/);
assert.match(source, /class="component-card component-table"/);
assert.match(source, /filter\(\(item: any\) => item\.status === "active"\)/);

console.log("Generated Todo app includes component-rendered task summary and table markers.");
