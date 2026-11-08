import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token, user } = useAuth();

  const loadMyBorrowings = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBorrowings(token);
      if (res.success) {
        setBorrowings(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Gagal memuat daftar peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadMyBorrowings();
    }
  }, [token]);

  const activeBorrows = borrowings.filter((b) => b.status === 'borrowed');
  const pastBorrows = borrowings.filter((b) => b.status === 'returned');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Buku Pinjaman Saya
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau buku yang sedang Anda bawa dan riwayat pengembalian Anda.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition duration-150 active:scale-[0.96] w-fit"
        >
          <BookOpen className="w-4 h-4" />
          Cari Buku Lain
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bagian Buku Sedang Dipinjam */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-white">Sedang Dipinjam</h2>
          <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
            {activeBorrows.length}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Memuat data...
          </div>
        ) : activeBorrows.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-400">
              Tidak ada buku yang sedang dipinjam saat ini.
            </p>
            <Link
              to="/"
              className="mt-3 inline-block text-xs font-semibold text-emerald-400 hover:underline"
            >
              Jelajahi Katalog Buku &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBorrows.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex gap-4 shadow-sm"
              >
                <div className="w-20 h-28 bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-700/60">
                  {item.cover_url ? (
                    <img
                      src={item.cover_url}
                      alt={item.book_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Aktif Dipinjam
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                      {item.book_title}
                    </h3>
                    <p className="text-xs text-slate-400">{item.book_author}</p>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-700/40">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dipinjam: {item.borrow_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tenggat: {item.due_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bagian Riwayat Pengembalian */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-white">Riwayat Pengembalian</h2>
          <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {pastBorrows.length}
          </span>
        </div>

        {pastBorrows.length === 0 ? (
          <div className="p-6 text-center bg-slate-900/30 border border-slate-800 rounded-xl text-xs text-slate-500">
            Belum ada riwayat buku yang dikembalikan.
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Judul Buku</th>
                    <th className="px-4 py-3 font-semibold">Penulis</th>
                    <th className="px-4 py-3 font-semibold">Tgl Pinjam</th>
                    <th className="px-4 py-3 font-semibold">Tgl Kembali</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {pastBorrows.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 font-medium text-white">{b.book_title}</td>
                      <td className="px-4 py-3 text-slate-400">{b.book_author}</td>
                      <td className="px-4 py-3 text-slate-400">{b.borrow_date}</td>
                      <td className="px-4 py-3 text-slate-400">{b.return_date || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-full text-[10px]">
                          Sudah Dikembalikan
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
