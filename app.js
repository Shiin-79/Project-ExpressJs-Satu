const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ErrorHandler = require("./utils/ErrorHandler");
const passport = require("passport");
const localStrategy = require("passport-local");

//? Connect Database
mongoose
  .connect("mongodb://localhost:27017/bestpoints")
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

//? set up view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//? middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const User = require("./models/user");

//? set up session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

//? set up flash
app.use(flash());

//? set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  next();
});

//? routes
app.get("/", (req, res) => {
  res.render("home");
});

//? authentication
app.use("/", require("./routes/auth"));
app.get("/register", async (req, res) => {
  const user = new User({
    email: "user@mail.com",
    username: "user",
  });

  const newUser = await User.register(user, "password");
  console.log(newUser);
  res.send(newUser);
});

app.use("/places", require("./routes/places"));

app.use("/places/:place_id/reviews", require("./routes/reviews"));

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
