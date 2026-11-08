# Project UTS - Sistem Peminjaman Perpustakaan (Fullstack)

Repositori gabungan (**Monorepo**) untuk tugas UTS Pengembangan Berbasis Komponen / Aplikasi Terdistribusi (PBAD) yang mencakup **Backend** (RESTful API) dan **Frontend** (Modern Web Client).

---

## 📁 Struktur Repositori

```text
project-uts/
├── backend/                  # REST API & Database SQLite
│   ├── src/
│   │   ├── config/           # Konfigurasi DB (SQLite) & Seeder Otomatis
│   │   ├── controllers/      # Logika Controller (Auth, Books, Borrowings)
│   │   ├── middlewares_helpers/ # Auth Middleware JWT & SQLite Helpers
│   │   ├── models/           # Data Models
│   │   ├── routes/           # Endpoint Routing API
│   │   └── sql_scripts/      # Skema Database Awal (init.sql)
│   ├── server.js             # Entry Point Server Express (Port 3000)
│   ├── package.json
│   └── readme.md
│
├── frontend/                 # Client SPA (Single Page Application)
│   ├── public/
│   ├── src/
│   │   ├── components/       # Komponen Reusable (Navbar, Footer, Modal, Card, dll)
│   │   ├── context/          # Auth Context & State Global
│   │   ├── pages/            # Halaman (Home, Login, Register, MemberDashboard, AdminDashboard)
│   │   ├── services/         # API Client Services
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js        # Konfigurasi Vite
│   ├── tailwind.config.js    # Konfigurasi Tailwind CSS
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Teknologi yang Digunakan

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS v3**
- **React Router DOM v7**
- **Lucide React** (Modern Icons)

### Backend
- **Node.js** & **Express 5**
- **SQLite3**
- **JSON Web Token (JWT)** (Otentikasi & Otorisasi Role)
- **Bcrypt.js** (Keamanan Enkripsi Password)
- **CORS**

---

## ⚙️ Cara Menjalankan Proyek di Lokal

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan).

### 1. Menjalankan Backend (Server API)

Buka terminal pertama di root proyek:
```bash
cd backend
npm install
npm run dev
# Atau: node server.js
```
> Server akan berjalan di: `http://localhost:3000`  
> Database SQLite (`database.sqlite`) dan akun uji coba akan dibuat serta diisi secara otomatis saat server pertama kali dijalankan.

### 2. Menjalankan Frontend (Client)

Buka terminal kedua di root proyek:
```bash
cd frontend
npm install
npm run dev
```
> Antarmuka web akan berjalan di: `http://localhost:5173`

---

## 🔑 Akun Uji Coba (Seed Data Bawaan)

Database secara otomatis menyediakan akun bawaan untuk pengujian:

| Role | Username / Email | Password | Hak Akses |
|---|---|---|---|
| **Admin** | `admin` / `admin@perpustakaan.com` | `admin123` | Kelola Buku, Kategori, & Konfirmasi Pengembalian |
| **Member / Pengunjung** | `budi` / `budi@gmail.com` | `user123` | Pinjam Buku & Lihat Riwayat Pinjaman Saya |
| **Member / Pengunjung** | `siti` / `siti@gmail.com` | `user123` | Pinjam Buku & Lihat Riwayat Pinjaman Saya |

---

## 📡 Daftar Endpoint API Utama

### Autentikasi (`/api/auth`)
- `POST /api/auth/register` - Pendaftaran akun baru
- `POST /api/auth/login` - Login pengguna & generate token JWT
- `GET /api/auth/me` - Verifikasi token & data profil user login

### Manajemen Buku (`/api/books`)
- `GET /api/books` - Daftar semua buku (dengan pencarian & filter kategori dinamis)
- `GET /api/books/categories` - Daftar unik kategori buku yang tersedia
- `GET /api/books/:id` - Detail spesifik buku
- `POST /api/books` - Tambah buku baru *(Khusus Admin)*
- `PUT /api/books/:id` - Perbarui data buku *(Khusus Admin)*
- `DELETE /api/books/:id` - Hapus data buku *(Khusus Admin)*

### Peminjaman Buku (`/api/borrowings`)
- `POST /api/borrowings` - Mengajukan peminjaman buku *(Khusus Member)*
- `GET /api/borrowings/my` - Daftar buku yang sedang & telah dipinjam *(Khusus Member)*
- `GET /api/borrowings` - Rekap seluruh transaksi peminjaman *(Khusus Admin)*
- `PUT /api/borrowings/:id/return` - Validasi & konfirmasi pengembalian buku *(Khusus Admin)*