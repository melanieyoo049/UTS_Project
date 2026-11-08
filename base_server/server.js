require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const { seedInitialData } = require('./src/config/seed');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const borrowRoutes = require('./src/routes/borrowRoutes');
const testRoutes = require('./src/routes/test');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend API Perpustakaan - Project UTS is running',
    endpoints: {
      'POST   /api/auth/register':   'Registrasi user baru',
      'POST   /api/auth/login':      'Login user/admin',
      'GET    /api/auth/me':         'Ambil profil user login',
      'GET    /api/books':           'Ambil semua buku (filter search/category)',
      'GET    /api/books/categories':'Ambil daftar kategori buku',
      'GET    /api/books/:id':       'Ambil detail buku by id',
      'POST   /api/books':           'Tambah buku baru (Admin)',
      'PUT    /api/books/:id':       'Update buku (Admin)',
      'DELETE /api/books/:id':       'Hapus buku (Admin)',
      'POST   /api/borrowings':      'Pinjam buku (Member)',
      'GET    /api/borrowings/my':   'Riwayat peminjaman member',
      'GET    /api/borrowings':      'Semua transaksi peminjaman (Admin)',
      'PUT    /api/borrowings/:id/return': 'Konfirmasi pengembalian buku (Admin)',
    },
  });
});

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowRoutes);
app.use('/api/test', testRoutes);
app.use('/api/products', productRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

/* Start */
(async () => {
  await initializeDatabase();
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
})();
