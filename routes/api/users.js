import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import { secretOrKey } from "../../config/keys.js";
import { validateRegisterInput } from "../../validation/register.js";
import { validateLoginInput } from "../../validation/login.js";
import { User } from "../../models/User.js";

const router = express.Router();

// @route POST api/users/register
// @desc Register user
router.post("/register", (request, result) => {
  const { errors, isValid } = validateRegisterInput(request.body);

  // Check validation
  if (!isValid) {
    return result.status(400).json(errors);
  }

  // Check if the user name already exist
  User.findOne({ email: request.body.email }).then((user) => {
    if (user) {
      return result.status(400).json({ email: "Email already exists!" });
    } else {
      const newUser = new User({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      });
      // Hash password before saving in database
      bcrypt.hash(newUser.password, 10, (error, hash) => {
        if (error) {
          throw error;
        }
        newUser.password = hash;
        newUser
          .save()
          .then((user) => result.json(user))
          .catch((error) => console.log(error));
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
router.post("/login", (request, result) => {
  const { errors, isValid } = validateLoginInput(request.body);

  // Check validation
  if (!isValid) {
    return result.status(400).json(errors);
  }

  // Find user by email
  User.findOne({ email: request.body.email }).then((user) => {
    if (!user) {
      return result.status(404).json({ emailnotfound: "Email not found!" });
    }
    // Check password
    bcrypt.compare(request.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name };
        // Sign token
        jwt.sign(
          payload,
          secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (error, token) => {
            result.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        return result
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

export default router;
