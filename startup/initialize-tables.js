import conn from "../config/mysql.js";

// Initialize all tables required for the application

export async function initializeTables() {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            auth_token VARCHAR(255),
            refresh_token VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`;

  try {
    const [result] = await conn.execute(createTableQuery);
    if (result.warningStatus === 0) {
      console.table({ mysql: "Initialized" });
    } else {
      console.table({ mysql: "Active" });
    }
  } catch (err) {
    console.error("Error creating table:", err);
  }
}
