import fs from "fs";
import { execSync } from "child_process";

// Confirm that the node_modules directory exists and that it is up to date

const nodeModulesExists = fs.existsSync("node_modules");
const packageLockUpdated =
  fs.statSync("package-lock.json").mtime > fs.statSync("node_modules").mtime;

if (!nodeModulesExists || packageLockUpdated) {
  execSync("npm install", { stdio: "inherit" });
}
