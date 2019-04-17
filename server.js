const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

//Use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config DB
const db = require("./config/keys").MongoUrl;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Data Base Connected");
  })
  .catch(err => {
    console.log(err);
  });

// use passport
app.use(passport.initialize());

//config passport
require("./config/passport")(passport);

//use the router
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.Port || 5000;

app.listen(port, console.log(`the server runing on port ${5000}`));
