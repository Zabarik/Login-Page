import jwt from "passport-jwt";
import mongoose from "mongoose";
import { secretOrKey } from "../config/keys.js";

const User = mongoose.model("users");
const ExtractJwt = jwt.ExtractJwt;
const JwtStrategy = jwt.Strategy;
const optioms = {};
optioms.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
optioms.secretOrKey = secretOrKey;

export default (passport) => {
  passport.use(
    new JwtStrategy(optioms, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((error) => console.log(error));
    })
  );
};
