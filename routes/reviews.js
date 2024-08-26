const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });

//? Middlewares
const isValidObjectId = require("../middlewares/isValidObjectId");
const { isAuthorReview } = require("../middlewares/isAuthor");
const isAuth = require("../middlewares/isAuth");
const { validateReview } = require("../middlewares/validator");

//? Controllers
const ReviewController = require("../controllers/reviews");

router.post(
  "/",
  validateReview,
  isAuth,
  isValidObjectId("/places"),
  wrapAsync(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(ReviewController.destroy)
);

module.exports = router;
