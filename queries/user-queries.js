import conn from "../config/mysql.js";

//  ----------------------------------------  SELECT QUERIES  ----------------------------------------  //

export const selectUserByEmail = async (email) => {
  try {
    const [result] = await conn.query(
      `SELECT email FROM users WHERE email = ?`,
      [email]
    );
    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const selectUserById = async (id) => {
  try {
    const [result] = await conn.query(`SELECT email FROM users WHERE id = ?`, [
      id,
    ]);
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

//  ----------------------------------------  INSERT QUERIES  ----------------------------------------  //

export const insertNewUser = async (email, password) => {
  try {
    const result = await conn.query(
      `
    INSERT INTO users (email, password) VALUES (?, ?)
    `,
      [email, password]
    );
    console.log(result);
    return result[0].insertId;
  } catch (error) {
    console.error(error);
    return null;
  }
};
