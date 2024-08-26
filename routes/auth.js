const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const AuthController = require("../controllers/auth");

//? Middleware to check if user is already logged in
const ensureNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/places");
  } else {
    next();
  }
};

router
  .route("/register")
  .get(ensureNotLoggedIn, AuthController.renderRegisterForm)
  .post(ensureNotLoggedIn, wrapAsync(AuthController.register));

router
  .route("/login")
  .get(ensureNotLoggedIn, AuthController.renderLoginForm)
  .post(
    ensureNotLoggedIn,
    passport.authenticate("local", {
      failureFlash: {
        type: "error_message",
        message: "Invalid username or password.",
      },
      failureRedirect: "/login",
    }),
    AuthController.login
  );

router.post("/logout", AuthController.logout);

module.exports = router;
