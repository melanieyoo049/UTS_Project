const bookModel = require('../models/bookModel');

const getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    const books = await bookModel.getAll({ search, category });
    return res.json({ success: true, data: books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookModel.getById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan.' });
    }
    return res.json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, category, stock, cover_url, description } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ success: false, message: 'Judul, penulis, dan kategori wajib diisi.' });
    }

    const result = await bookModel.create({
      title,
      author,
      category,
      stock: parseInt(stock, 10) || 1,
      cover_url: cover_url || '',
      description: description || ''
    });

    const newBook = await bookModel.getById(result.lastID);
    return res.status(201).json({ success: true, message: 'Buku berhasil ditambahkan.', data: newBook });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, stock, cover_url, description } = req.body;

    const existingBook = await bookModel.getById(id);
    if (!existingBook) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan.' });
    }

    await bookModel.update(id, {
      title: title || existingBook.title,
      author: author || existingBook.author,
      category: category || existingBook.category,
      stock: stock !== undefined ? parseInt(stock, 10) : existingBook.stock,
      cover_url: cover_url !== undefined ? cover_url : existingBook.cover_url,
      description: description !== undefined ? description : existingBook.description
    });

    const updated = await bookModel.getById(id);
    return res.json({ success: true, message: 'Data buku berhasil diperbarui.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBook = await bookModel.getById(id);
    if (!existingBook) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan.' });
    }

    await bookModel.delete(id);
    return res.json({ success: true, message: 'Buku berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await bookModel.getCategories();
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
};
