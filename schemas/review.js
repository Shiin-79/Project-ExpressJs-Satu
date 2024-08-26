const joi = require("joi");

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      body: joi.string().min(3).required(),
      rating: joi.number().min(1).max(5).required().min(0),
    })
    .required(),
});
