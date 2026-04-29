import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "topogram-demo-template-conflict-"));
const projectRoot = path.join(tempRoot, "project");
const candidateRoot = path.join(tempRoot, "candidate-template");
const conflictFile = path.join("topogram", "entities", "entity-task.tg");

function copyProject() {
  fs.cpSync(repoRoot, projectRoot, {
    recursive: true,
    filter(source) {
      const relative = path.relative(repoRoot, source);
      const firstSegment = relative.split(path.sep)[0];
      return !new Set([".git", ".tmp", "app", "node_modules"]).has(firstSegment);
    }
  });
}

function writeCandidateTemplate() {
  const projectConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, "topogram.project.json"), "utf8"));
  fs.mkdirSync(candidateRoot, { recursive: true });
  fs.cpSync(path.join(projectRoot, "topogram"), path.join(candidateRoot, "topogram"), { recursive: true });
  fs.cpSync(path.join(projectRoot, "implementation"), path.join(candidateRoot, "implementation"), { recursive: true });
  fs.copyFileSync(path.join(projectRoot, "topogram.project.json"), path.join(candidateRoot, "topogram.project.json"));
  fs.writeFileSync(
    path.join(candidateRoot, "topogram-template.json"),
    `${JSON.stringify({
      id: projectConfig.template.id,
      version: `${projectConfig.template.version}-conflict-proof`,
      kind: "starter",
      topogramVersion: "^0.2.0",
      includesExecutableImplementation: true,
      description: "Conflict proof candidate for the Todo demo template update workflow."
    }, null, 2)}\n`,
    "utf8"
  );
}

function runApply() {
  return childProcess.spawnSync("topogram", ["template", "update", "--apply", "--template", candidateRoot, "--json"], {
    cwd: projectRoot,
    encoding: "utf8",
    env: { ...process.env, PATH: process.env.PATH || "" }
  });
}

try {
  copyProject();
  writeCandidateTemplate();
  fs.appendFileSync(path.join(projectRoot, conflictFile), "\n# local conflict proof edit\n", "utf8");
  fs.appendFileSync(path.join(candidateRoot, conflictFile), "\n# candidate conflict proof edit\n", "utf8");

  const result = runApply();
  if (result.status === 0) {
    console.error("Template update apply unexpectedly succeeded.");
    console.error(result.stdout || result.stderr);
    process.exit(1);
  }

  const payload = JSON.parse(result.stdout);
  const hasConflict = (payload.diagnostics || []).some((diagnostic) => diagnostic.code === "template_update_conflict");
  if (!hasConflict) {
    console.error("Template update apply did not report template_update_conflict.");
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }

  const currentText = fs.readFileSync(path.join(projectRoot, conflictFile), "utf8");
  if (!currentText.includes("# local conflict proof edit") || currentText.includes("# candidate conflict proof edit")) {
    console.error("Template update apply changed the locally edited file.");
    process.exit(1);
  }
  console.log("Template update conflict guard passed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
