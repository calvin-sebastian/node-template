import pool from "../config/mysql.js";

// Confirm database is connected

export async function checkDatabaseConnection() {
  try {
    const result = await pool.execute("SELECT 1");
    return result[0][0];
  } catch (error) {
    throw error;
  }
}
