const mongoose = require("mongoose");
const Shcema = mongoose.Schema;

const reviewSchema = new Shcema({
  body: String,
  rating: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
