import pool from "../config/mysql.js";

//  ----------------------------------------  SELECT QUERIES  ----------------------------------------  //

export const selectUserByEmail = async (email) => {
  try {
    const [result] = await pool.query(
      `SELECT email, password FROM users WHERE email = ?`,
      [email]
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};

export const selectUserById = async (id) => {
  try {
    const [result] = await pool.query(`SELECT email FROM users WHERE id = ?`, [
      id,
    ]);
    return result[0];
  } catch (error) {
    throw error;
  }
};

//  ----------------------------------------  INSERT QUERIES  ----------------------------------------  //

export const insertNewUser = async (email, password) => {
  try {
    const result = await pool.query(
      `
    INSERT INTO users (email, password) VALUES (?, ?)
    `,
      [email, password]
    );
    return result[0].insertId;
  } catch (error) {
    throw error;
  }
};

//  ----------------------------------------  UDPATE QUERIES  ----------------------------------------  //

export const updateUserRefreshToken = async (id, refreshToken) => {
  try {
    const result = await pool.query(
      `
    UPDATE users SET refresh_token = ? WHERE id = ?
    `,
      [refreshToken, id]
    );
    return result[0].affectedRows;
  } catch (error) {
    throw error;
  }
};
