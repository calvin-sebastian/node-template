import { ValidationError } from "../errors/error-handling.js";
import {
  createAccountSchema,
  emailSchema,
  loginSchema,
} from "./user-schemas.js";

export const validateEmail = async (req, res, next) => {
  try {
    await emailSchema.validate(req.body.email);
    next();
  } catch (err) {
    next(new ValidationError(err.errors[0]));
  }
};

export const validateLogin = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body);
    next();
  } catch (err) {
    next(new ValidationError(err.errors[0]));
  }
};

export const validateCreateAccount = async (req, res, next) => {
  try {
    await createAccountSchema.validate(req.body);
    next();
  } catch (err) {
    next(new ValidationError(err.errors[0]));
  }
};
