import express from "express";
import {
  createAccount,
  verifyEmail,
  login,
  refreshToken,
} from "../controllers/user-controller.js";
import {
  validateCreateAccount,
  validateEmail,
  validateLogin,
} from "../validation/user-validation.js";

const USER_ROUTES = express.Router();

// GET Routes

USER_ROUTES.get("/refresh-token", refreshToken);

// POST Routes

USER_ROUTES.post("/", validateEmail, verifyEmail);

USER_ROUTES.post("/create", validateCreateAccount, createAccount);

USER_ROUTES.post("/login", validateLogin, login);

export default USER_ROUTES;
