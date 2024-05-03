import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(new Error("Password encryption failed"));
      else resolve(hash);
    });
  });
};
