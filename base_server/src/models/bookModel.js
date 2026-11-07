const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const bookModel = {
  create: async ({ title, author, category, stock = 1, cover_url = '', description = '' }) => {
    const query = `
      INSERT INTO books (title, author, category, stock, cover_url, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return dbRun(query, [title, author, category, stock, cover_url, description]);
  },

  getAll: async ({ search = '', category = '' } = {}) => {
    let query = `SELECT * FROM books WHERE 1=1`;
    const params = [];

    if (search) {
      query += ` AND (title LIKE ? OR author LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    query += ` ORDER BY id DESC`;
    return dbAll(query, params);
  },

  getById: async (id) => {
    const query = `SELECT * FROM books WHERE id = ?`;
    return dbGet(query, [id]);
  },

  update: async (id, { title, author, category, stock, cover_url, description }) => {
    const query = `
      UPDATE books
      SET title = ?, author = ?, category = ?, stock = ?, cover_url = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return dbRun(query, [title, author, category, stock, cover_url, description, id]);
  },

  decreaseStock: async (id) => {
    const query = `
      UPDATE books
      SET stock = stock - 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND stock > 0
    `;
    return dbRun(query, [id]);
  },

  increaseStock: async (id) => {
    const query = `
      UPDATE books
      SET stock = stock + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return dbRun(query, [id]);
  },

  delete: async (id) => {
    const query = `DELETE FROM books WHERE id = ?`;
    return dbRun(query, [id]);
  },

  getCategories: async () => {
    const query = `
      SELECT DISTINCT category 
      FROM books 
      WHERE category IS NOT NULL AND TRIM(category) != ''
      ORDER BY category ASC
    `;
    const rows = await dbAll(query);
    return rows.map((r) => r.category);
  }
};

module.exports = bookModel;
git pull origin main