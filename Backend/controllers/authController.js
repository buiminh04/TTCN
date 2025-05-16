const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Đăng ký
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra đầu vào
        if (!username || !email || !password) {
            return res.render('register', { error: 'Vui lòng nhập đầy đủ thông tin' });
        }

        if (username.length < 8 || password.length < 8) {
            return res.render('register', { error: 'Tên đăng nhập và mật khẩu phải có ít nhất 8 ký tự' });
        }

        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.render('register', { error: 'Email phải là địa chỉ Gmail hợp lệ' });
        }

        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (userExists) {
            return res.render('register', { error: 'Người dùng đã tồn tại' });
        }

        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password,
            role: 'user'
        });

        await newUser.save();

        return res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        return res.render('register', { error: 'Lỗi server' });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { error: 'Vui lòng nhập email/username và mật khẩu' });
        }

        const user = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: email }]
        });

        if (!user) {
            return res.render('login', { error: 'Email/Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Email/Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        const token = generateToken(user._id, user.role);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            sameSite: 'Strict'
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.render('login', { error: 'Lỗi server' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
};

module.exports = { register, login, logout };