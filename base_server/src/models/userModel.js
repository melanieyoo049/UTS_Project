const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const userModel = {
  create: async ({ name, username, email, password, role = 'member' }) => {
    const query = `
      INSERT INTO users (name, username, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    return dbRun(query, [name, username, email, password, role]);
  },

  findByEmailOrUsername: async (identifier) => {
    const query = `
      SELECT * FROM users
      WHERE email = ? OR username = ?
      LIMIT 1
    `;
    return dbGet(query, [identifier, identifier]);
  },

  findById: async (id) => {
    const query = `
      SELECT id, name, username, email, role, created_at
      FROM users
      WHERE id = ?
    `;
    return dbGet(query, [id]);
  },

  getAll: async () => {
    const query = `
      SELECT id, name, username, email, role, created_at
      FROM users
      ORDER BY id DESC
    `;
    return dbAll(query);
  }
};

module.exports = userModel;
