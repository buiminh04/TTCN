const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/admin/orders', auth, isAdmin, orderController.getAllOrders);
router.post('/delete/:id', auth, isAdmin, orderController.deleteOrder);

module.exports = router;
