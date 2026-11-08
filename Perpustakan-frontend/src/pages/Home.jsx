import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Search, Library, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(['Semua']);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [message, setMessage] = useState(null);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success && Array.isArray(res.data)) {
        setCategories(['Semua', ...res.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks(search, category);
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  const handleBorrow = async (book) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      setMessage({ type: 'error', text: 'Akun Admin tidak meminjam buku. Gunakan menu manajemen.' });
      return;
    }

    try {
      setBorrowingId(book.id);
      const res = await api.borrowBook(token, book.id);
      if (res.success) {
        setMessage({ type: 'success', text: `Buku "${book.title}" berhasil dipinjam.` });
        loadBooks();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem saat meminjam buku.' });
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Ringkas */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/60 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
            <Library className="w-3.5 h-3.5" />
            Katalog Perpustakaan Terbuka
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Peminjaman Buku Cepat dan Terstruktur
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Pilih buku yang Anda butuhkan, periksa ketersediaan stok secara langsung, dan kelola peminjaman Anda.
          </p>
        </div>
      </div>

      {/* Alert Notifikasi */}
      {message && (
        <div
          className={`mb-6 p-3.5 rounded-xl border text-sm flex items-center justify-between transition ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-75 hover:opacity-100 font-semibold px-2 py-0.5"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter & Pencarian */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul buku atau penulis..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = (cat === 'Semua' && !category) || category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'Semua' ? '' : cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition duration-150 active:scale-[0.96] ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Katalog Buku */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Memuat daftar buku...
        </div>
      ) : books.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium">Tidak ada buku yang sesuai.</p>
          <p className="text-slate-600 text-xs mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={handleBorrow}
              isBorrowing={borrowingId === book.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
