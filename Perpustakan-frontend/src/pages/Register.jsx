import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.register(
        formData.name,
        formData.username,
        formData.email,
        formData.password
      );

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Daftar Akun Pengunjung</h1>
          <p className="text-xs text-slate-400 mt-1">
            Buat akun untuk meminjam buku dan melihat riwayat perpustakaan Anda.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Pendaftaran berhasil! Mengalihkan ke halaman masuk...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="budisantoso"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="budi@email.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-lg shadow-sm transition duration-150 active:scale-[0.96] disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
