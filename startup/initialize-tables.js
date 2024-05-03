import { logTable } from "../console/log-functions.js";
import conn from "../config/mysql.js";

// Define the initialization queries for each table

const initializationQueries = [
  {
    table: "users",
    query: `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  permissions ENUM('user', 'user', 'admin', 'root') DEFAULT 'user',
  auth_token VARCHAR(255),
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
  //
  // Execute all queries in parallel

  const results = await Promise.all(
    initializationQueries.map(async ({ table, query }) => {
      try {
        const [result] = await conn.execute(query);
        const status = result.warningStatus === 0 ? "Initialized" : "Active";
        return [table, status];
      } catch (err) {
        console.error(`Error creating ${table} table:`, err);
        // If an error occurred, return an object with the table name and error status

        return [table, "Error"];
      }
    })
  );

  // Display the results in a table
  logTable(["Table", "Status"], ...results);
}
