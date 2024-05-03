import * as yup from "yup";

export const emailSchema = yup.string().email();

export const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      "Password must contain at least one letter, one number, and be between 6 to 20 characters long"
    )
    .required("Password is required"),
});

export const createAccountSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      "Password must contain at least one letter, one number, and be between 6 to 20 characters long"
    )
    .required("Password is required"),
  matching_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password matching is required"),
});
