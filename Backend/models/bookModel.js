const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String },
  publisher: { type: String },
  supplier: { type: String },
  year: { type: Number },
  language: { type: String },
  format: { type: String },
  pageCount: { type: Number },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  category: { type: String },
  group: { type: String },
  description: { type: String },
  image: { type: String, default: "/default.jpg" },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);