import fs from "fs";
import { execSync } from "child_process";

const nodeModulesExists = fs.existsSync("node_modules");
const packageLockUpdated =
  fs.statSync("package-lock.json").mtime > fs.statSync("node_modules").mtime;

if (!nodeModulesExists || packageLockUpdated) {
  execSync("npm install", { stdio: "inherit" });
}
