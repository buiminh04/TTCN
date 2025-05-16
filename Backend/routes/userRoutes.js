const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { getUserProfile, updateUser, updateAddress } = require('../controllers/userController');

router.get('/customer', auth, async (req, res) => {
  try {
    const user = await getUserProfile(req, res, true);
    console.log('User từ getUserProfile:', user);
    if (user) {
      res.render('customer/customer', { user });
    } else {
      console.log('Không tìm thấy user');
      res.status(404).render('error', { message: 'Không tìm thấy thông tin người dùng' });
    }
  } catch (error) {
    console.error('Lỗi trong route /customer:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi render trang customer' });
  }
});

router.get('/customer/address', auth, async (req, res) => {
  try {
    const user = await getUserProfile(req, res, true);
    if (user) {
      res.render('customer/customer-addr', { user });
    } else {
      res.status(404).render('error', { message: 'Không tìm thấy thông tin người dùng' });
    }
  } catch (error) {
    console.error('Lỗi trong route /customer/address:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server' });
  }
});

router.get('/customer/change-password', auth, (req, res) => {
  res.render('customer/change-key');
});

router.get('/customer/orders', auth, (req, res) => {
  res.render('customer/order/order');
});

router.get('/customer/orders/check', auth, (req, res) => {
  res.render('customer/order/order-check');
});

router.get('/customer/orders/transport', auth, (req, res) => {
  res.render('customer/order/order-transport');
});

router.get('/customer/orders/receive', auth, (req, res) => {
  res.render('customer/order/order-receive');
});

router.get('/customer/orders/cancel', auth, (req, res) => {
  res.render('customer/order/order-cancel');
});

router.post('/customer/update', auth, async (req, res) => {
  try {
    const success = await updateUser(req, res);
    if (success) {
      res.redirect('/customer');
    } else {
      res.status(400).render('customer/customer', {
        user: req.user,
        error: 'Lỗi cập nhật thông tin'
      });
    }
  } catch (error) {
    console.error('Lỗi trong route /customer/update:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi cập nhật' });
  }
});

router.post('/customer/address/update', auth, updateAddress);

module.exports = router;