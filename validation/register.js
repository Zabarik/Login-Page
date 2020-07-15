import Validator from "validator";
import isEmpty from "is-empty";

export function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string
  data.name = isEmpty(data.name) ? "" : data.name;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.password_rep = isEmpty(data.password_rep) ? "" : data.password_rep;

  // Name check
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Email check
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password check
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.password_rep)) {
    errors.password_rep = "Confirm password field is required";
  }
  if (
    !Validator.matches(
      data.password,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
    )
  ) {
    errors.password =
      "Password must include one lowercase character, one uppercase character, one number, one special character and be at least 8 characters long.";
  }
  if (!Validator.equals(data.password, data.password_rep)) {
    errors.password_rep = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
