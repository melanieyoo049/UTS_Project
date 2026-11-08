const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const api = {
  // Auth
  login: async (identifier, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  register: async (name, username, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password }),
    });
    return res.json();
  },

  getProfile: async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Books
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/books/categories`);
    return res.json();
  },

  getBooks: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/books?${params.toString()}`);
    return res.json();
  },

  createBook: async (token, bookData) => {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });
    return res.json();
  },

  updateBook: async (token, id, bookData) => {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });
    return res.json();
  },

  deleteBook: async (token, id) => {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Borrowings
  borrowBook: async (token, book_id, notes = '') => {
    const res = await fetch(`${API_BASE}/borrowings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id, notes }),
    });
    return res.json();
  },

  getMyBorrowings: async (token) => {
    const res = await fetch(`${API_BASE}/borrowings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  getAllBorrowings: async (token) => {
    const res = await fetch(`${API_BASE}/borrowings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  returnBook: async (token, borrowId) => {
    const res = await fetch(`${API_BASE}/borrowings/${borrowId}/return`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
