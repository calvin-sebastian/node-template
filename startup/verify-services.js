import conn from "../config/mysql.js";

export async function checkDatabaseConnection() {
  try {
    await conn.execute("SELECT 1");
    return ["Database", "Active", `Connected to ${process.env.DB_NAME}`];
  } catch (error) {
    return [
      "Database",
      "Error",
      error.message || "An error occurred while connecting to the database",
    ];
  }
}
