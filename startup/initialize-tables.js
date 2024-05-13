import { headers, logTable } from "../console/log-functions.js";
import pool from "../config/mysql.js";
import fs from "fs";
import path from "path";
import { checkDatabaseConnection } from "./verify-services.js";
import dotenv from "dotenv";
dotenv.config();

const currentDir = process.cwd();
const envPath = path.resolve(currentDir, ".env");

// Define the initialization queries for each table

const databaseTables = [
  {
    table: "users",
    query: `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  permissions ENUM('user', 'super-user', 'admin', 'root') DEFAULT 'user',
  refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  },
  {
    table: "permissions",
    query: `CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(255) UNIQUE,
  user BOOLEAN DEFAULT FALSE,
  super_user BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE,
  root BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  },
];

export async function initializeTables() {
  try {
    if (!fs.existsSync(envPath)) {
      logTable(headers, [
        ".env",
        "Error",
        "Run 'npm run init-env' or include a .env file in the root directory of the project",
      ]);
      process.exit(1);
    }
    try {
      await checkDatabaseConnection();
    } catch (error) {
      logTable(headers, [
        "Database",
        "Error",
        "Run 'npm run init-db' or manually set up your database",
      ]);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error creating database: ${error.message}`);
    process.exit(1);
  }

  // Create all tables in parallel

  const results = await Promise.all(
    databaseTables.map(async ({ table, query }) => {
      try {
        const [result] = await pool.execute(query);
        const status = result.warningStatus === 0 ? "Initialized" : "Active";
        const message =
          result.warningStatus === 0
            ? "Table initialized successfully"
            : "Table already exists";
        return [table, status, message];
      } catch (err) {
        return [
          table,
          "Error",
          err.message || "Table unable to be initialized",
        ];
      }
    })
  );

  logTable(["Table", "Status"], ...results);
  process.exit(0);
}

await initializeTables();
