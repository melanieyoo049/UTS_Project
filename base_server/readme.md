# Sistem Informasi Perpustakaan - Backend REST API (Project UTS)

REST API backend untuk aplikasi peminjaman buku perpustakaan menggunakan **Node.js**, **Express.js**, **SQLite3**, dan **JWT (JSON Web Token)**.

## Fitur Utama

- **Autentikasi & Otorisasi**:
  - Registrasi pengguna baru (*Member*) dengan enkripsi password menggunakan bcryptjs.
  - Login (*Admin* & *Member*) menggunakan token JWT.
  - Endpoint profil pengguna yang sedang login (`/api/auth/me`).
  - Middleware perlindungan rute (`verifyToken`) dan proteksi hak akses khusus Admin (`requireAdmin`).

- **Manajemen Katalog Buku**:
  - Mengambil semua daftar buku (dilengkapi pencarian judul/penulis & filter kategori).
  - Mengambil detail buku berdasarkan ID.
  - Mendapatkan daftar kategori buku yang tersedia.
  - Tambah, ubah (*update*), dan hapus (*delete*) data buku (Khusus Admin).

- **Manajemen Peminjaman Buku**:
  - Peminjaman buku oleh Member (otomatis mengurangi stok buku).
  - Riwayat peminjaman buku untuk akun yang sedang login.
  - Melihat semua transaksi peminjaman (Khusus Admin).
  - Konfirmasi pengembalian buku (Khusus Admin, otomatis mengembalikan stok buku).

## Struktur Project

```text
base_server/
├── server.js              # Entry point utama aplikasi Express
├── database.sqlite        # File database SQLite
├── .env                   # Variabel environment (PORT, JWT_SECRET)
├── .env.example           # Template environment
├── package.json
└── src/
    ├── config/
    │   ├── database.js    # Koneksi SQLite & inisialisasi tabel
    │   └── seed.js        # Data awal (default admin, member, buku)
    ├── controllers/
    │   ├── authController.js
    │   ├── bookController.js
    │   └── borrowController.js
    ├── middlewares_helpers/
    │   ├── authMiddleware.js
    │   └── sqlite3_helpers.js
    ├── models/
    │   ├── bookModel.js
    │   ├── borrowModel.js
    │   └── userModel.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── bookRoutes.js
    │   ├── borrowRoutes.js
    │   └── test.js
    └── sql_scripts/
        └── init.sql       # Skrip DDL tabel database
```

## Panduan Instalasi & Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment
Pastikan file `.env` sudah ada:
```env
PORT=3000
JWT_SECRET=melani_super_secret_jwt_key_uts_2026
```

### 3. Jalankan Server
```bash
npm run dev
# atau
npm start
```
Server akan berjalan di `http://localhost:3000`. Database SQLite beserta akun default dan data buku akan di-seed otomatis pada saat start pertama kali.

## Default Akun Bawaan (Seeding)
- **Admin**:
  - Username: `admin` | Password: `adminpassword123`
- **Member**:
  - Username: `melani` | Password: `melanipassword123`
