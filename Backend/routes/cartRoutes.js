const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', cartController.getCart);
router.post('/add/:id', cartController.addToCart);
router.post('/increase/:id', cartController.increaseQuantity);
router.post('/decrease/:id', cartController.decreaseQuantity);
router.post('/remove/:id', cartController.removeFromCart);
router.get('/checkout', cartController.checkout);

module.exports = router;
