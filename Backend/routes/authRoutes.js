const express = require('express');
const {register, login, logout} = require('../controllers/authController');
const {auth, isAdmin} = require('../middleware/authMiddleware');
const router = express.Router(); 

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/profile', auth, (req, res) => {
    res.render('profile', { user: req.user });
});

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/admin', auth, isAdmin);

module.exports = router;