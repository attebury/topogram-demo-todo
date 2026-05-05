import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const routePath = path.resolve("app/apps/web/app_sveltekit/src/routes/tasks/+page.svelte");
const source = fs.readFileSync(routePath, "utf8");

assert.match(source, /data-topogram-component="component_ui_task_summary"/);
assert.match(source, /data-topogram-component="component_ui_task_table"/);
assert.match(source, /class="component-card component-summary"/);
assert.match(source, /class="component-card component-table"/);
assert.match(source, /<span>Total<\/span>/);
assert.match(source, /<span>Fields<\/span>/);
assert.match(source, /<span>Identified<\/span>/);
assert.match(source, /Object\.keys\(data\.result\.items\[0\] \?\? \{\}\)\.slice\(0, 4\)/);

console.log("Generated Todo app includes component-rendered summary and table markers.");
