import fs from "fs";
import path from "path";
import { headers, logTable } from "../console/log-functions.js";

async function checkEnvVariables() {
  const currentDir = process.cwd();
  const envPath = path.resolve(currentDir, ".env");

  // Create .env file if it doesnt exist
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(
      envPath,
      `PORT="3000"\nDB_HOST="127.0.0.1"\nDB_USER="root"\nDB_PASSWORD=""\nDB_NAME="test_database"\nACCESS_TOKEN_SECRET="change-this-secret"\nREFRESH_TOKEN_SECRET="also-change-this-secret"\nNODE_ENV="development"`
    );
    return logTable(headers, [
      ".env",
      "Initialized",
      "Created file with default values",
    ]);
  }
  logTable(headers, [".env", "Active", "File already exists"]);
}

checkEnvVariables();
