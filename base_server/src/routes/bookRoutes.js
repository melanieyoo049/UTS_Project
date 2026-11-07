const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, requireAdmin } = require('../middlewares_helpers/authMiddleware');

// Akses publik: Lihat katalog, kategori & detail buku
router.get('/', bookController.getAllBooks);
router.get('/categories', bookController.getCategories);
router.get('/:id', bookController.getBookById);

// Akses khusus admin: Tambah, edit, hapus buku
router.post('/', verifyToken, requireAdmin, bookController.createBook);
router.put('/:id', verifyToken, requireAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, requireAdmin, bookController.deleteBook);

module.exports = router;
