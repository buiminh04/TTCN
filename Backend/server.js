require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const connectDB = require('./config/db');

const User = require('./models/userModel');
const Book = require('./models/bookModel');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../Frontend/views'));
app.use(express.static(path.join(__dirname, '../Frontend/styles')));
app.use(express.static(path.join(__dirname, '../Frontend/img')));

// Trang chủ
app.get('/', async (req, res) => {
  let user = null;
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select('username role');
    } catch (err) {
      console.log("Token không hợp lệ");
    }
  }

  try {
    const banChay = await Book.find({ group: 'banchay' }).limit(8);
    const manga = await Book.find({ group: 'manga' }).limit(8);
    const comboSach = await Book.find({ group: 'combo' }).limit(8);

    res.render('home', {
      user,
      banChay,
      manga,
      comboSach
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sách:", error);
    res.status(500).send('Lỗi khi tải trang chủ');
  }
});

app.get('/login', (req, res) => res.redirect('/auth/login'));
app.get('/register', (req, res) => res.redirect('/auth/register'));

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/', reviewRoutes);
app.use('/', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Lỗi server' });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
