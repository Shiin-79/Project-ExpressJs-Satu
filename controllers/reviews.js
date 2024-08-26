const Review = require("../models/review");
const Place = require("../models/place");

module.exports.store = async (req, res) => {
  const { place_id } = req.params;
  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  const place = await Place.findById(place_id);
  place.reviews.push(review);
  await place.save();
  req.flash("success_message", "Successfully added a review!!");
  res.redirect(`/places/${place._id}`);
};

module.exports.destroy = async (req, res) => {
  const { review_id, place_id } = req.params;
  await Place.findByIdAndUpdate(place_id, {
    $pull: {
      reviews: review_id,
    },
  });
  await Review.findByIdAndDelete(review_id);
  req.flash("success_message", "Successfully deleted a review!!");
  res.redirect(`/places/${place_id}`);
};
