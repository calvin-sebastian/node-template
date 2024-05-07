import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { headers, logTable } from "../console/log-functions.js";
import fs from "fs";
import path from "path";
import { checkDatabaseConnection } from "./verify-services.js";
dotenv.config();

// Define path to environment variables

const currentDir = process.cwd();
const envPath = path.resolve(currentDir, ".env");

// Define the database configuration using environment variables

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function intializeDatabase() {
  // Check if the .env file exists and prompt user to create one if it doesnt
  try {
    if (!fs.existsSync(envPath)) {
      logTable(headers, [
        ".env",
        "Error",
        "Run 'npm run init-env' or include a .env file in the root directory of the project",
      ]);
      process.exit(1);
    }
    // Check if the database connection is active and if it isnt, create a new database
    try {
      const connected = await checkDatabaseConnection();
      if (connected) {
        logTable(headers, [
          "Database",
          "Active",
          `Already connected to ${process.env.DB_NAME}`,
        ]);
        process.exit(0);
      }
    } catch (error) {
      if (error.code === "ER_BAD_DB_ERROR") {
        await createDatabase(dbConfig);
      } else {
        console.error(`Error connecting to database: ${error.message}`);
      }
    }
    logTable(headers, [
      "Database",
      "Initialized",
      `Created new schema: ${process.env.DB_NAME}`,
    ]);
    process.exit(0);
  } catch (error) {
    console.error(`Error creating database: ${error.message}`);
    process.exit(1);
  }
}

async function createDatabase(dbConfig) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
  } catch (error) {
    throw new Error(`Error creating database: ${error.message}`);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

intializeDatabase();
