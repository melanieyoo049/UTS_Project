const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const borrowModel = {
  create: async ({ user_id, book_id, notes = '' }) => {
    const query = `
      INSERT INTO borrowings (user_id, book_id, notes)
      VALUES (?, ?, ?)
    `;
    return dbRun(query, [user_id, book_id, notes]);
  },

  getAll: async () => {
    const query = `
      SELECT b.id, b.user_id, b.book_id, b.borrow_date, b.due_date, b.return_date, b.status, b.notes,
             u.name as user_name, u.email as user_email,
             bk.title as book_title, bk.author as book_author, bk.cover_url
      FROM borrowings b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      ORDER BY b.id DESC
    `;
    return dbAll(query);
  },

  getByUserId: async (user_id) => {
    const query = `
      SELECT b.id, b.user_id, b.book_id, b.borrow_date, b.due_date, b.return_date, b.status, b.notes,
             bk.title as book_title, bk.author as book_author, bk.cover_url, bk.category
      FROM borrowings b
      JOIN books bk ON b.book_id = bk.id
      WHERE b.user_id = ?
      ORDER BY b.id DESC
    `;
    return dbAll(query, [user_id]);
  },

  getById: async (id) => {
    const query = `SELECT * FROM borrowings WHERE id = ?`;
    return dbGet(query, [id]);
  },

  findActiveBorrow: async (user_id, book_id) => {
    const query = `
      SELECT * FROM borrowings
      WHERE user_id = ? AND book_id = ? AND status = 'borrowed'
    `;
    return dbGet(query, [user_id, book_id]);
  },

  returnBook: async (id) => {
    const query = `
      UPDATE borrowings
      SET status = 'returned', return_date = DATE('now')
      WHERE id = ? AND status = 'borrowed'
    `;
    return dbRun(query, [id]);
  }
};

module.exports = borrowModel;
