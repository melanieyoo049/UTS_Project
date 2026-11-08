const borrowModel = require('../models/borrowModel');
const bookModel = require('../models/bookModel');

const borrowBook = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { book_id, notes } = req.body;

    if (!book_id) {
      return res.status(400).json({ success: false, message: 'ID buku wajib disertakan.' });
    }

    const book = await bookModel.getById(book_id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan.' });
    }

    if (book.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Stok buku sedang habis.' });
    }

    const activeBorrow = await borrowModel.findActiveBorrow(user_id, book_id);
    if (activeBorrow) {
      return res.status(400).json({
        success: false,
        message: 'Anda sedang meminjam buku ini. Kembalikan terlebih dahulu sebelum meminjam lagi.'
      });
    }

    const borrowResult = await borrowModel.create({
      user_id,
      book_id,
      notes: notes || ''
    });

    await bookModel.decreaseStock(book_id);

    return res.status(201).json({
      success: true,
      message: 'Peminjaman berhasil dicatat.',
      data: { borrow_id: borrowResult.lastID, book_title: book.title }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBorrowings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const borrowings = await borrowModel.getByUserId(user_id);
    return res.json({ success: true, data: borrowings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await borrowModel.getAll();
    return res.json({ success: true, data: borrowings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const borrowRecord = await borrowModel.getById(id);

    if (!borrowRecord) {
      return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan.' });
    }

    if (borrowRecord.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Buku ini sudah berstatus dikembalikan.' });
    }

    await borrowModel.returnBook(id);
    await bookModel.increaseStock(borrowRecord.book_id);

    return res.json({
      success: true,
      message: 'Buku berhasil dikembalikan dan stok telah dipulihkan.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  borrowBook,
  getMyBorrowings,
  getAllBorrowings,
  returnBook
};
