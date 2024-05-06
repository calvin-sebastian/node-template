import { encryptPassword } from "../encryption/encryption-functions.js";
import {
  ConflictError,
  InternalServerError,
  ValidationError,
} from "../console/error-handling.js";
import {
  insertNewUser,
  selectUserByEmail,
  updateUserRefreshToken,
} from "../queries/user-queries.js";
import { emailSchema } from "../validation/user-schemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//  --------------------  VALIDATE EMAIL TO REDIRECT USER TO LOGIN OR REGISTER  --------------------  //

export const verifyEmail = async (req, res, next) => {
  const email = req.body?.email;

  try {
    await emailSchema.validate(email);
  } catch (err) {
    return next(new ValidationError(err.errors[0]));
  }
  try {
    const result = await selectUserByEmail(email);
    console.log(result);
    if (!result) {
      return res.status(404).send({ user: false, message: "User not found" });
    }
    return res.status(200).send({ user: result.email, message: "User found" });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};

//  ----------------------------------------  CREATE NEW USER  ----------------------------------------  //

export const createAccount = async (req, res, next) => {
  const email = req.body?.email;
  const password = req.body?.password;
  try {
    const accountExists = await selectUserByEmail(email);
    if (accountExists) {
      return next(
        new ConflictError("An account already exists under this email")
      );
    }
  } catch (err) {
    return next(new InternalServerError(err.message));
  }

  try {
    const hash = await encryptPassword(password);

    const insertId = await insertNewUser(email, hash);
    if (!insertId) throw new Error("Account unable to be created");

    return res.status(201).send("User created successfully");
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};

//  ------------------------------------------  USER LOGIN  ------------------------------------------  //

export const login = async (req, res, next) => {
  const email = req.body?.email;
  const password = req.body?.password;
  try {
    const accountExists = await selectUserByEmail(email);
    if (!accountExists) {
      return next(
        new ConflictError("An account does not exist under this email")
      );
    }

    // Confirm password

    const passwordsMatch = await bcrypt.compare(
      password,
      accountExists.password
    );
    if (!passwordsMatch) throw new Error("Incorrect password");

    // Create authorization and refresh tokens using JWT

    const authToken = jwt.sign(
      { id: accountExists.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { id: accountExists.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await updateUserRefreshToken(accountExists.id, refreshToken);

    return res.status(200).send({
      auth_token: authToken,
      refresh_token: refreshToken,
      message: "Successfully logged in",
    });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};
