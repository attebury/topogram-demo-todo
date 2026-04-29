import childProcess from "node:child_process";

function run(args) {
  const result = childProcess.spawnSync("topogram", args, {
    encoding: "utf8",
    env: { ...process.env, PATH: process.env.PATH || "" }
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  return JSON.parse(result.stdout);
}

function assertClean(payload, label) {
  const summary = payload.summary || {};
  const issues = payload.issues || [];
  const files = payload.files || [];
  const conflicts = payload.conflicts || [];
  if (issues.length || files.length || conflicts.length || summary.added || summary.changed || summary.currentOnly) {
    console.error(`${label} is not clean.`);
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }
}

const plan = run(["template", "update", "--plan", "--json"]);
if (plan.writes !== false) {
  console.error("Template update plan should not write files.");
  process.exit(1);
}
assertClean(plan, "Template update plan");

const check = run(["template", "update", "--check", "--json"]);
if (check.writes !== false) {
  console.error("Template update check should not write files.");
  process.exit(1);
}
assertClean(check, "Template update check");

const apply = run(["template", "update", "--apply", "--json"]);
if (apply.writes !== false || (apply.applied || []).length !== 0) {
  console.error("No-op template update apply should not write files.");
  console.error(JSON.stringify(apply, null, 2));
  process.exit(1);
}
assertClean(apply, "Template update apply");
console.log("Template update no-op guard passed.");
