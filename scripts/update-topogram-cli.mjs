import childProcess from "node:child_process";

const version = process.argv[2] || "";
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const packageName = "@attebury/topogram";
const registry = "https://npm.pkg.github.com";

if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) {
  console.error("Usage: npm run update:topogram-cli -- <version>");
  console.error("Example: npm run update:topogram-cli -- 0.2.31");
  process.exit(1);
}

if (!process.env.NODE_AUTH_TOKEN) {
  console.warn("Warning: NODE_AUTH_TOKEN is not set. npm may still work if GitHub Packages auth is configured globally.");
}

const exactSpec = `${packageName}@${version}`;
const dependencySpec = `${packageName}@^${version}`;

console.log(`Checking GitHub Packages for ${exactSpec}...`);
const view = run(npmBin, ["view", exactSpec, "version", `--registry=${registry}`], {
  capture: true,
  allowFailure: true
});

if (view.status !== 0) {
  console.error(`Unable to read ${exactSpec} from GitHub Packages.`);
  printOutput(view);
  console.error("");
  console.error("Make sure this repo can read @attebury packages and run with:");
  console.error("  NODE_AUTH_TOKEN=<github-token-with-package-read> npm run update:topogram-cli -- " + version);
  process.exit(view.status || 1);
}

const publishedVersion = view.stdout.trim();
if (publishedVersion !== version) {
  console.error(`Expected ${exactSpec}, but npm returned version '${publishedVersion || "(empty)"}'.`);
  process.exit(1);
}

console.log(`Installing ${dependencySpec}...`);
run(npmBin, ["install", "--save-dev", dependencySpec]);

console.log("Running consumer checks...");
run(npmBin, ["run", "cli:surface"]);
run(npmBin, ["run", "catalog:template-show"]);
run(npmBin, ["run", "check"]);

console.log("");
console.log(`Updated ${packageName} to ^${version}.`);
console.log("Next steps:");
console.log("  git diff package.json package-lock.json");
console.log("  git commit -am \"Update Topogram CLI to " + version + "\"");
console.log("  git push");
console.log("  confirm Demo Verification passes");

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    env: {
      ...process.env,
      PATH: process.env.PATH || ""
    }
  });
  if (!options.allowFailure && result.status !== 0) {
    process.exit(result.status || 1);
  }
  return result;
}

function printOutput(result) {
  if (result.stdout) {
    process.stderr.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}
