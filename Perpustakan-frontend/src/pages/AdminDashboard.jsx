import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Clock, 
  X,
  PackageCheck,
  Users,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { token, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'borrowings' | 'members'
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);

  // Modal State Tambah / Edit Buku
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    stock: 1,
    cover_url: '',
    description: '',
  });

  // Tarif denda per hari (Rp 1.000)
  const FINE_PER_DAY = 1000;

  // Proteksi Akses Khusus Admin
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login');
    }
  }, [token, isAdmin, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksRes, catRes, borrowRes, usersRes] = await Promise.all([
        api.getBooks(),
        api.getCategories(),
        api.getAllBorrowings(token),
        api.getUsers(token),
      ]);

      if (booksRes.success) setBooks(booksRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
      if (borrowRes.success) setBorrowings(borrowRes.data || []);
      if (usersRes.success) setMembers(usersRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memuat data dari server. Pastikan backend aktif.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      loadData();
    }
  }, [token, isAdmin]);

  // Fungsi Menghitung Keterlambatan dan Denda
  const calculateFine = (borrow) => {
    const dueDate = new Date(borrow.due_date);
    const returnOrCurrentDate = borrow.return_date ? new Date(borrow.return_date) : new Date();

    dueDate.setHours(0, 0, 0, 0);
    returnOrCurrentDate.setHours(0, 0, 0, 0);

    const diffTime = returnOrCurrentDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        lateDays: diffDays,
        fine: diffDays * FINE_PER_DAY,
        isLate: true,
      };
    }

    return {
      lateDays: 0,
      fine: 0,
      isLate: false,
    };
  };

  // Fungsi Export Data Peminjaman ke Excel (.csv)
  const exportToExcel = () => {
    if (borrowings.length === 0) {
      alert('Tidak ada data peminjaman untuk diunduh.');
      return;
    }

    const headers = ['No', 'Peminjam', 'Email', 'Judul Buku', 'Tanggal Pinjam', 'Tenggat Waktu', 'Tanggal Kembali', 'Status', 'Hari Terlambat', 'Denda (Rp)'];
    const rows = borrowings.map((b, idx) => {
      const fineInfo = calculateFine(b);
      return [
        idx + 1,
        `"${b.user_name || ''}"`,
        `"${b.user_email || ''}"`,
        `"${b.book_title || ''}"`,
        b.borrow_date || '-',
        b.due_date || '-',
        b.return_date || '-',
        b.status === 'borrowed' ? 'Sedang Dipinjam' : 'Dikembalikan',
        fineInfo.lateDays,
        fineInfo.fine,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_peminjaman_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form Handlers
  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      category: categories[0] || 'Umum',
      stock: 1,
      cover_url: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      category: book.category || 'Umum',
      stock: book.stock ?? 1,
      cover_url: book.cover_url || '',
      description: book.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.category) {
      setMessage({ type: 'error', text: 'Judul, penulis, dan kategori wajib diisi.' });
      return;
    }

    try {
      if (editingBook) {
        const res = await api.updateBook(token, editingBook.id, formData);
        if (res.success) {
          setMessage({ type: 'success', text: `Buku "${formData.title}" berhasil diperbarui.` });
          closeModal();
          loadData();
        } else {
          setMessage({ type: 'error', text: res.message || 'Gagal memperbarui buku.' });
        }
      } else {
        const res = await api.createBook(token, formData);
        if (res.success) {
          setMessage({ type: 'success', text: `Buku "${formData.title}" berhasil ditambahkan.` });
          closeModal();
          loadData();
        } else {
          setMessage({ type: 'error', text: res.message || 'Gagal menambahkan buku.' });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem saat menyimpan data buku.' });
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus buku "${title}"?`)) return;

    try {
      const res = await api.deleteBook(token, id);
      if (res.success) {
        setMessage({ type: 'success', text: `Buku "${title}" berhasil dihapus.` });
        loadData();
      } else {
        setMessage({ type: 'error', text: res.message || 'Gagal menghapus buku.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menghapus buku.' });
    }
  };

  const handleReturnBook = async (borrowId, bookTitle) => {
    if (!window.confirm(`Konfirmasi pengembalian buku "${bookTitle}"?`)) return;

    try {
      const res = await api.returnBook(token, borrowId);
      if (res.success) {
        setMessage({ type: 'success', text: `Buku "${bookTitle}" berhasil dikembalikan. Stok buku bertambah.` });
        loadData();
      } else {
        setMessage({ type: 'error', text: res.message || 'Gagal memproses pengembalian.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memproses pengembalian buku.' });
    }
  };

  // Filter Buku
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  // Statistik Ringkas
  const totalBooks = books.length;
  const totalStock = books.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
  const activeBorrowingsCount = borrowings.filter((b) => b.status === 'borrowed').length;
  const totalMembersCount = members.filter((m) => m.role === 'member').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Dashboard Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel Manajemen Administrator
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard Pengelola Perpustakaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola katalog buku, pantau peminjam & pengembalian, periksa denda, dan lihat anggota terdaftar.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition duration-150 active:scale-[0.96] w-fit"
        >
          <Plus className="w-4 h-4" />
          Tambah Buku Baru
        </button>
      </div>

      {/* Alert Notifikasi */}
      {message && (
        <div
          className={`mb-6 p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition ${
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
            className="text-xs font-bold opacity-75 hover:opacity-100 px-2 py-0.5"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Ringkasan Statistik 4 Kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Judul Buku</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totalBooks}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Stok Fisik</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totalStock} buku</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Sedang Dipinjam</p>
            <p className="text-2xl font-bold text-white mt-0.5">{activeBorrowingsCount} buku</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Anggota Terdaftar</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totalMembersCount} orang</p>
          </div>
        </div>
      </div>

      {/* Tab Navigasi */}
      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-150 flex items-center gap-2 ${
            activeTab === 'books'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Katalog & Stok Buku ({filteredBooks.length})
        </button>

        <button
          onClick={() => setActiveTab('borrowings')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-150 flex items-center gap-2 ${
            activeTab === 'borrowings'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Daftar Peminjam ({borrowings.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-150 flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-purple-400 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Data Anggota ({members.length})
        </button>
      </div>

      {/* KONTEN TAB 1: KELOLA BUKU */}
      {activeTab === 'books' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, penulis, atau kategori..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Segarkan Data
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs sm:text-sm">
              Memuat data katalog buku...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="p-10 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">Buku tidak ditemukan.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 font-semibold text-xs">
                    <tr>
                      <th className="px-4 py-3.5">Cover & Judul</th>
                      <th className="px-4 py-3.5">Kategori</th>
                      <th className="px-4 py-3.5">Penulis</th>
                      <th className="px-4 py-3.5 text-center">Stok</th>
                      <th className="px-4 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                    {filteredBooks.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                            src={b.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'}
                            alt={b.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200';
                            }}
                            className="w-10 h-14 object-cover rounded-md border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white line-clamp-1">{b.title}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{b.description || 'Tanpa sinopsis'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {b.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-300">{b.author}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            b.stock > 0 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {b.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(b)}
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                              title="Edit Buku"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(b.id, b.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                              title="Hapus Buku"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KONTEN TAB 2: DAFTAR PEMINJAM & DENDA */}
      {activeTab === 'borrowings' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Perhitungan denda: <span className="font-semibold text-amber-400">Rp 1.000 / hari keterlambatan</span> dari batas tanggal tenggat.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-sm font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                Export ke Excel (CSV)
              </button>
              <button
                onClick={loadData}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Segarkan
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs sm:text-sm">
              Memuat data daftar peminjam...
            </div>
          ) : borrowings.length === 0 ? (
            <div className="p-10 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">Belum ada riwayat peminjaman buku.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 font-semibold text-xs">
                    <tr>
                      <th className="px-4 py-3.5">Peminjam</th>
                      <th className="px-4 py-3.5">Judul Buku</th>
                      <th className="px-4 py-3.5">Tgl Pinjam</th>
                      <th className="px-4 py-3.5">Tenggat Waktu</th>
                      <th className="px-4 py-3.5">Denda & Keterlambatan</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                    {borrowings.map((b) => {
                      const fineInfo = calculateFine(b);
                      return (
                        <tr key={b.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-white">{b.user_name}</p>
                            <p className="text-[11px] text-slate-400">{b.user_email}</p>
                          </td>
                          <td className="px-4 py-3 font-medium text-white">{b.book_title}</td>
                          <td className="px-4 py-3 text-slate-400">{b.borrow_date}</td>
                          <td className="px-4 py-3 text-slate-400">{b.due_date}</td>
                          <td className="px-4 py-3">
                            {fineInfo.isLate ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>{fineInfo.lateDays} hr &bull; Rp {fineInfo.fine.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <span className="text-emerald-400 text-[11px] font-medium">Tepat Waktu (Rp 0)</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {b.status === 'borrowed' ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300">
                                Sedang Dipinjam
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                Selesai ({b.return_date})
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {b.status === 'borrowed' && (
                              <button
                                onClick={() => handleReturnBook(b.id, b.book_title)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition"
                              >
                                <PackageCheck className="w-3.5 h-3.5" />
                                Verifikasi Kembali
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KONTEN TAB 3: DATA ANGGOTA TERDAFTAR */}
      {activeTab === 'members' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Daftar seluruh pengguna yang telah memiliki akun di sistem perpustakaan.
            </p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Segarkan Data
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs sm:text-sm">
              Memuat data anggota terdaftar...
            </div>
          ) : members.length === 0 ? (
            <div className="p-10 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">Belum ada pengguna terdaftar.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 font-semibold text-xs">
                    <tr>
                      <th className="px-4 py-3.5">ID</th>
                      <th className="px-4 py-3.5">Nama Lengkap</th>
                      <th className="px-4 py-3.5">Username</th>
                      <th className="px-4 py-3.5">Email</th>
                      <th className="px-4 py-3.5">Peran (Role)</th>
                      <th className="px-4 py-3.5 text-right">Tanggal Bergabung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 text-slate-500 font-mono">#{m.id}</td>
                        <td className="px-4 py-3 font-semibold text-white">{m.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">@{m.username}</td>
                        <td className="px-4 py-3 text-slate-300">{m.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            m.role === 'admin'
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          }`}>
                            {m.role === 'admin' ? 'Administrator' : 'Anggota Member'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          {m.created_at ? m.created_at.slice(0, 10) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT BUKU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                {editingBook ? 'Edit Data Buku & Stok' : 'Tambah Buku Baru'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Buku *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Belajar Pemrograman Modern"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Penulis / Pengarang *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Nama penulis"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Contoh: Teknologi, Sastra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jumlah Stok Fisik *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL Cover Buku (Opsional)</label>
                  <input
                    type="url"
                    value={formData.cover_url}
                    onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sinopsis / Deskripsi</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan singkat tentang buku ini..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition active:scale-[0.96]"
                >
                  {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
