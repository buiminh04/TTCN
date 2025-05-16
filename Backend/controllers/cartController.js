const Book = require('../models/bookModel');
const Cart = require('../models/cartModel');

exports.getCart = async (req, res) => {
  try {
    let cartItems = [];
    let total = 0;

    if (req.user) {
      const cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
      cartItems = cart?.items || [];
      total = cartItems.reduce((sum, item) => sum + item.quantity * (item.bookId?.price || 0), 0);
    } else {
      const sessionCart = req.session.cart || [];
      cartItems = sessionCart;
      total = sessionCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }

    res.render('cart/cart', { cartItems, total });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy giỏ hàng');
  }
};

exports.addToCart = async (req, res) => {
  const bookId = req.params.id;
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send('Sách không tồn tại');

    if (req.user) {
      let cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

      const existing = cart.items.find(i => i.bookId.toString() === bookId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ bookId, quantity });
      }

      await cart.save();
      return res.status(200).json({ message: 'Đã thêm vào giỏ hàng' });

    } else {
      if (!req.session.cart) req.session.cart = [];

      const existing = req.session.cart.find(i => i.productId == bookId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        req.session.cart.push({
          productId: book._id,
          title: book.title,
          price: book.price,
          quantity,
          image: book.image
        });
      }

      return res.status(200).json({ message: 'Đã thêm vào giỏ hàng' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi thêm vào giỏ hàng');
  }
};

exports.increaseQuantity = async (req, res) => {
  const bookId = req.params.id;
  try {
    if (req.user) {
      const cart = await Cart.findOne({ userId: req.user._id });
      const item = cart.items.find(i => i.bookId.toString() === bookId);
      if (item) item.quantity += 1;
      await cart.save();
    } else {
      const cart = req.session.cart || [];
      const item = cart.find(i => i.productId == bookId);
      if (item) item.quantity += 1;
      req.session.cart = cart;
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.decreaseQuantity = async (req, res) => {
  const bookId = req.params.id;
  try {
    if (req.user) {
      const cart = await Cart.findOne({ userId: req.user._id });
      const item = cart.items.find(i => i.bookId.toString() === bookId);
      if (item && item.quantity > 1) item.quantity -= 1;
      await cart.save();
    } else {
      const cart = req.session.cart || [];
      const item = cart.find(i => i.productId == bookId);
      if (item && item.quantity > 1) item.quantity -= 1;
      req.session.cart = cart;
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.removeFromCart = async (req, res) => {
  const bookId = req.params.id;
  try {
    if (req.user) {
      let cart = await Cart.findOne({ userId: req.user._id });
      cart.items = cart.items.filter(i => i.bookId.toString() !== bookId);
      await cart.save();
    } else {
      let cart = req.session.cart || [];
      cart = cart.filter(i => i.productId != bookId);
      req.session.cart = cart;
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.checkout = async (req, res) => {
  try {
    let cartItems = [];
    let total = 0;
    let userAddress = null;

    console.log('User:', req.user ? req.user._id : 'No user'); // Debug user
    console.log('Session cart:', req.session.cart); // Debug session cart

    if (req.user) {
      // Người dùng đăng nhập
      const cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
      console.log('Database cart:', cart); // Debug cart từ database

      if (!cart || cart.items.length === 0) {
        console.log('No cart or empty cart for user');
        return res.redirect('/cart');
      }

      cartItems = cart.items.map(i => ({
        book: {
          _id: i.bookId._id,
          title: i.bookId.title,
          image: i.bookId.image,
          price: i.bookId.price
        },
        quantity: i.quantity,
        price: i.bookId.price
      }));

      total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      userAddress = req.user.address || null;
      console.log('User address:', userAddress); // Debug địa chỉ
    } else {
      // Người dùng chưa đăng nhập
      const sessionCart = req.session.cart || [];
      console.log('Session cart items:', sessionCart); // Debug session cart

      if (sessionCart.length === 0) {
        console.log('Empty session cart');
        return res.redirect('/cart');
      }

      cartItems = sessionCart.map(item => ({
        book: {
          _id: item.productId,
          title: item.title,
          image: item.image,
          price: item.price
        },
        quantity: item.quantity,
        price: item.price
      }));

      total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    console.log('Final checkout data:', { cartItems, total, userAddress }); // Debug dữ liệu cuối

    res.render('cart/checkout', {
      cart: cartItems,
      total,
      userAddress
    });
  } catch (err) {
    console.error('Error in checkout:', err);
    res.redirect('/cart');
  }
};