# Sistem Manajemen Perpustakaan - Project UTS

Aplikasi web fullstack untuk sistem perpustakaan dan peminjaman buku berbasis **React (Vite)** dan **Node.js (Express & SQLite3)**.

## 📁 Struktur Repositori

```text
UTS_Project/
├── base_server/               # Backend REST API (Express.js + SQLite)
│   ├── .env.example           # Contoh konfigurasi environment backend
│   ├── package.json
│   ├── server.js              # Entrypoint server
│   └── src/                   # Controllers, models, routes, database
└── Perpustakan-frontend/      # Frontend Web Client (React + Vite + TailwindCSS)
    ├── .env.example           # Contoh konfigurasi environment frontend
    ├── package.json
    ├── vite.config.js
    └── src/                   # Components, pages, context, services
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Menjalankan Backend (`base_server`)
1. Buka terminal dan masuk ke folder `base_server`:
   ```bash
   cd base_server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` (bisa salin dari `.env.example`):
   ```env
   PORT=3000
   JWT_SECRET=rahasia_jwt_kamu_uts_2026
   ```
4. Jalankan backend:
   ```bash
   npm run dev
   # atau
   npm start
   ```
   Server backend akan aktif di: `http://localhost:3000`

---

### 2. Menjalankan Frontend (`Perpustakan-frontend`)
1. Buka terminal baru dan masuk ke folder `Perpustakan-frontend`:
   ```bash
   cd Perpustakan-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` (bisa salin dari `.env.example`):
   ```env
   VITE_API_BASE=http://localhost:3000/api
   ```
4. Jalankan aplikasi React:
   ```bash
   npm run dev
   ```
   Aplikasi frontend akan aktif di: `http://localhost:5173`

---

## 🔑 Akun Demo (Default Seeding)
- **Akun Admin:**
  - Username: `admin`
  - Password: `adminpassword123`
- **Akun Member:**
  - Username: `melani`
  - Password: `melanipassword123`
