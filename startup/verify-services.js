import pool from "../config/mysql.js";

export async function checkDatabaseConnection() {
  try {
    const result = await pool.execute("SELECT 1");
    return result[0][0];
  } catch (error) {
    throw error;
  }
}
