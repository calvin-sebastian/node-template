import { encryptPassword } from "../encryption/encryption-functions.js";
import {
  ConflictError,
  InternalServerError,
  ValidationError,
} from "../console/error-handling.js";
import { insertNewUser, selectUserByEmail } from "../queries/user-queries.js";
import { emailSchema } from "../validation/user-schemas.js";
import bcrypt from "bcrypt";

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
    if (!result) {
      return res.status(404).send({ user: false, message: "User not found" });
    }
    return res.status(200).send({ user: result, message: "User found" });
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
    const passwordsMatch = await bcrypt.compare(
      password,
      accountExists.password
    );
    if (!passwordsMatch) throw new Error("Incorrect password");

    //  < ---------------------------------------------------------------------------------------------------------------  FUTURE

    // generate tokens, insert them into user table, and send them back to the client

    // const auth_token = generateAuthToken(accountExists.id);
    // const refresh_token = generateRefreshToken(accountExists.id);

    const updatedUser = await updateTokens(
      accountExists.id,
      auth_token,
      refresh_token
    );

    return res.status(200).send({
      auth_token: updatedUser.auth_token,
      refresh_token: updatedUser.refresh_token,
      message: "Successfully logged in",
    });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};
