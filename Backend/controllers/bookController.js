const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const getHomepageBooks = async (req, res) => {
  try {
    const banChay = await Book.find({ group: 'banchay' });
    const tamlyHoc = await Book.find({ group: 'tamlyhoc' });
    const selfHelp = await Book.find({ group: 'selfhelp' });
    const manga = await Book.find({ group: 'manga' });
    const combo = await Book.find({ group: 'combo' });
    res.render('home', {
      user: req.user,
      banChay,
      manga,
      tamlyHoc,
      selfHelp,
      comboSach: combo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi tải sách');
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json(books);
    }
    res.render('books/all', { books });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Không tìm thấy sách");

    const reviews = await Review.find({ book: book._id }).populate("user", "username");

    const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : null;

    let user = null;
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select("username role");
    }

    res.render("product", { book, reviews, averageRating, totalReviews: reviews.length, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
};

const createBook = async (req, res) => {
  try {
    const { code, title, author, publisher, supplier, year, language, format, pageCount, price, stock, sold, category, group, description } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : '/default.jpg';

    const newBook = new Book({ code, title, author, publisher, supplier, year, language, format, pageCount, price, stock, sold, category, group, description });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { code, title, author, publisher, supplier, year, language, format, pageCount, price, stock, sold, category, group, description } = req.body;
    const updateData = { code, title, author, publisher, supplier, year, language, format, pageCount, price, stock, sold, category, group, description };

    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.json({ message: "Đã xóa sách" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.categoryName });
    res.render('books/category', { books, category: req.params.categoryName });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { getHomepageBooks, getBooks, getBookById, createBook, updateBook, deleteBook, getBooksByCategory };
