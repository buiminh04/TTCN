const Order = require('../models/orderModel');

const canReview = async (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.user._id;

  const hasPurchased = await Order.exists({
    user: userId,
    'items.book': bookId,
    status: { $in: ['delivered', 'transporting', 'pending'] }
  });

  if (!hasPurchased) {
    return res.status(403).send('Bạn chỉ có thể đánh giá sản phẩm đã mua.');
  }

  next();
};

module.exports = canReview;
