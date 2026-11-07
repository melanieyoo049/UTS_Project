const bcrypt = require('bcryptjs');
const { dbRun, dbGet } = require('../middlewares_helpers/sqlite3_helpers');

const seedInitialData = async () => {
  try {
    // 1. Seed Admin Default
    const existingAdmin = await dbGet("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await dbRun(`
        INSERT INTO users (name, username, email, password, role)
        VALUES ('Administrator', 'admin', 'admin@perpustakaan.com', ?, 'admin')
      `, [adminPassword]);
      console.log('✅ Akun Admin berhasil dibuat: admin / admin123');
    }

    // 2. Seed Pengunjung Default (Member)
    const existingMember = await dbGet("SELECT * FROM users WHERE role = 'member' LIMIT 1");
    if (!existingMember) {
      const memberPassword = await bcrypt.hash('member123', 10);
      await dbRun(`
        INSERT INTO users (name, username, email, password, role)
        VALUES ('Melanie Yoo', 'melanie', 'melanie@perpustakaan.com', ?, 'member')
      `, [memberPassword]);
      console.log('✅ Akun Pengunjung berhasil dibuat: melanie / member123');
    }

    // 3. Seed Buku Contoh
    const existingBooks = await dbGet("SELECT COUNT(*) as count FROM books");
    if (existingBooks && existingBooks.count === 0) {
      const sampleBooks = [
        {
          title: 'Filosofi Teras',
          author: 'Henry Manampiring',
          category: 'Filsafat & Self-Development',
          stock: 4,
          cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
          description: 'Penerapan filsafat Stoa kuno untuk mental tangguh di era modern.'
        },
        {
          title: 'Atomic Habits',
          author: 'James Clear',
          category: 'Self-Development',
          stock: 3,
          cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
          description: 'Cara mudah dan terbukti untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk.'
        },
        {
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          category: 'Teknologi & Pemrograman',
          stock: 2,
          cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?w=500&auto=format&fit=crop&q=60',
          description: 'Panduan standar industri untuk menulis kode perangkat lunak yang rapi dan mudah dirawat.'
        },
        {
          title: 'Laskar Pelangi',
          author: 'Andrea Hirata',
          category: 'Sastra & Fiksi',
          stock: 5,
          cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
          description: 'Kisah inspiratif persahabatan anak-anak Belitung dalam menempuh pendidikan.'
        }
      ];

      for (const book of sampleBooks) {
        await dbRun(`
          INSERT INTO books (title, author, category, stock, cover_url, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [book.title, book.author, book.category, book.stock, book.cover_url, book.description]);
      }
      console.log('✅ Seed 4 data buku awal berhasil.');
    }
  } catch (error) {
    console.error('⚠️ Gagal menjalankan seed data:', error.message);
  }
};

module.exports = { seedInitialData };
