import { encryptPassword } from "../encryption/encryption-functions.js";
import {
  ConflictError,
  InternalServerError,
  ValidationError,
} from "../console/error-handling.js";
import {
  insertNewUser,
  selectUserByEmail,
  selectUserById,
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

    // Verify user does not exist and send back result to redirect user to login or register based on result

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

  // Encrypt password and insert new user into database

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

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires after 7 days
    });

    return res.status(200).send({
      auth_token: authToken,
      message: "Successfully logged in",
    });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};

//  ----------------------------------------  REFRESH ACCESS TOKEN  ----------------------------------------  //

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ValidationError("Refresh token not found"));
  }

  try {
    // Verify refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the refresh token exists in the database
    const user = await selectUserById(payload.id);
    if (user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Create new access token
    const authToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      auth_token: authToken,
      message: "Successfully refreshed access token",
    });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};
