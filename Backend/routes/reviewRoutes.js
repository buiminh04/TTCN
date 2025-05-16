const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, isAdmin } = require('../middleware/authMiddleware');

router.post('/:bookId', auth, reviewController.addReview);
router.get('/:bookId', reviewController.getReviewsByBook);
router.delete('/:id', auth, reviewController.deleteReview);
module.exports = router;
