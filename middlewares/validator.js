const ErrorHandler = require("../utils/ErrorHandler");
//? Schemas
const { placeSchema } = require("../schemas/place");
const { reviewSchema } = require("../schemas/review");

module.exports.validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ErrorHandler(message, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(error.message, 400));
  } else {
    next();
  }
};
