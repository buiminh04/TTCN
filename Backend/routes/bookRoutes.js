const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

const { auth, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.get('/category/:categoryName', bookController.getBooksByCategory);

router.post('/', auth, isAdmin, upload.single('image'), bookController.createBook);
router.put('/:id', auth, isAdmin, bookController.updateBook);
router.delete('/:id', auth, isAdmin, bookController.deleteBook);

module.exports = router;
