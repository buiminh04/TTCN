const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
