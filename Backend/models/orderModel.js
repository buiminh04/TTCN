const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  address: {
    fullname: String,
    phone: String,
    address: String
  },
  note: { type: String },
  status: {
    type: String,
    enum: ['pending', 'transporting', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
