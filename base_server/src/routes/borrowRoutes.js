const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { verifyToken, requireAdmin } = require('../middlewares_helpers/authMiddleware');

// Akses member (pengunjung): Pinjam buku & lihat riwayat sendiri
router.post('/', verifyToken, borrowController.borrowBook);
router.get('/my', verifyToken, borrowController.getMyBorrowings);

// Akses admin: Lihat semua transaksi peminjaman & verifikasi pengembalian
router.get('/', verifyToken, requireAdmin, borrowController.getAllBorrowings);
router.put('/:id/return', verifyToken, requireAdmin, borrowController.returnBook);

module.exports = router;
