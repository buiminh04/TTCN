const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { auth } = require('../middleware/authMiddleware');

router.get('/', auth, checkoutController.checkoutPage);

module.exports = router;
