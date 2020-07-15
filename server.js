import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { mongoURL } from "./config/keys.js";
import passport from "passport";
import users from "./routes/api/users.js";
import ps from "./config/passport.js";

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
ps(passport);
app.use("/api/users", users);

// Connect to MongoDB
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected!"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server up!"));
