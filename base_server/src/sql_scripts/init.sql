CREATE TABLE IF NOT EXISTS test_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Pengguna (Admin & Member/Pengunjung)
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL CHECK(role IN ('admin', 'member')) DEFAULT 'member',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Buku Perpustakaan
CREATE TABLE IF NOT EXISTS books (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    author      TEXT NOT NULL,
    category    TEXT NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 1,
    cover_url   TEXT,
    description TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Transaksi Peminjaman Buku
CREATE TABLE IF NOT EXISTS borrowings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    book_id     INTEGER NOT NULL,
    borrow_date DATE DEFAULT (DATE('now')),
    due_date    DATE DEFAULT (DATE('now', '+7 days')),
    return_date DATE,
    status      TEXT NOT NULL CHECK(status IN ('borrowed', 'returned')) DEFAULT 'borrowed',
    notes       TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
