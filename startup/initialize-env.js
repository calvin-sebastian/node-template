import fs from "fs";
import path from "path";

async function checkEnvVariables() {
  const currentDir = process.cwd();
  const envPath = path.resolve(currentDir, ".env");

  // Create .env file if it doesnt exist
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(
      envPath,
      `PORT="3000"\nDB_HOST="127.0.0.1"\nDB_USER="root"\nDB_PASSWORD=""\nDB_NAME="tq_database"\nACCESS_TOKEN_SECRET="change-this-secret"\n`
    );
  }
}

checkEnvVariables();
