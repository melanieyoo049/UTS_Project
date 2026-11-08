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

    const parsedStock = parseInt(stock, 10);
    const finalStock = Number.isNaN(parsedStock) ? 1 : parsedStock;
    if (finalStock < 0) {
      return res.status(400).json({ success: false, message: 'Jumlah stok tidak boleh bernilai negatif.' });
    }

    const result = await bookModel.create({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      stock: finalStock,
      cover_url: cover_url ? cover_url.trim() : '',
      description: description ? description.trim() : ''
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

    let finalStock = existingBook.stock;
    if (stock !== undefined) {
      const parsedStock = parseInt(stock, 10);
      if (Number.isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ success: false, message: 'Jumlah stok tidak valid (harus angka >= 0).' });
      }
      finalStock = parsedStock;
    }

    await bookModel.update(id, {
      title: title !== undefined ? title.trim() : existingBook.title,
      author: author !== undefined ? author.trim() : existingBook.author,
      category: category !== undefined ? category.trim() : existingBook.category,
      stock: finalStock,
      cover_url: cover_url !== undefined ? cover_url.trim() : existingBook.cover_url,
      description: description !== undefined ? description.trim() : existingBook.description
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
