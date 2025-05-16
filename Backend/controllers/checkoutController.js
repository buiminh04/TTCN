const Cart = require('../models/cartModel');
const User = require('../models/userModel');

const checkoutPage = async (req, res) => {
  if (!req.user) return res.redirect('/login');

  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
    if (!cart || cart.items.length === 0) return res.redirect('/cart');

    const cartItems = cart.items.map(i => ({
      book: i.bookId,
      quantity: i.quantity,
      price: i.bookId.price,
    }));

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const user = await User.findById(req.user._id);
    const userAddress = user.address || null;

    res.render('cart/checkout', {
      cart: cartItems,
      total,
      userAddress
    });
  } catch (err) {
    console.error(err);
    res.redirect('/cart');
  }
};

module.exports = { checkoutPage };