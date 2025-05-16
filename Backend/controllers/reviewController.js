const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;
  const userId = req.user._id;
  try {
    const order = await Order.findOne({
      user: userId,
      'items.book': bookId,
      status: 'delivered' 
    });

    if (!order) {
      return res.status(403).json({ message: "Bạn phải mua sách này để đánh giá." });
    }

    const existingReview = await Review.findOne({ user: userId, book: bookId });
    if (existingReview) {
      return res.status(400).json({ message: "Bạn đã đánh giá sách này rồi." });
    }

    const review = new Review({
      user: userId,
      book: bookId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ book: bookId }).populate("user", "username");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    const isAdmin = req.user.role === 'admin';
    const isOwner = review.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Không có quyền xóa đánh giá này" });
    }

    await review.deleteOne();
    res.json({ message: "Xóa đánh giá thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { addReview, getReviewsByBook, deleteReview };
