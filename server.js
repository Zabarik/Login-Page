import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { mongoURL } from "./config/keys.js";
import passport from "passport";
import users from "./routes/api/users.js";
import ps from "./config/passport.js";
import path from "path";

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

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("*", (request, response) => {
    response.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server up!"));
