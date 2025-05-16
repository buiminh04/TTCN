const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, default: 1, min: 1 },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);