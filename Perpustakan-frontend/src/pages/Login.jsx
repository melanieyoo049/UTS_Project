import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LogIn, ShieldCheck, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('member'); // 'member' (default) | 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isAdminMode = role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(identifier, password);
      if (res.success) {
        // Validasi kesesuaian peran yang dipilih dengan kredensial
        if (isAdminMode && res.user.role !== 'admin') {
          setError('Akun ini bukan akun Administrator. Masuk melalui mode Pengunjung.');
          setLoading(false);
          return;
        }

        login(res.token, res.user);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/my-books');
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = () => {
    setError('');
    setIdentifier('');
    setPassword('');
    setRole((prev) => (prev === 'member' ? 'admin' : 'member'));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl transition-all">
        {/* Header Form */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex p-3 rounded-xl border mb-3 transition-colors ${
              isAdminMode
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {isAdminMode ? <ShieldCheck className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {isAdminMode ? 'Masuk Panel Administrator' : 'Masuk sebagai Pengunjung'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdminMode
              ? 'Akses khusus untuk mengelola katalog buku dan transaksi peminjaman.'
              : 'Gunakan akun Anda untuk meminjam buku dan memantau peminjaman aktif.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Masukkan Username"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
          </div>

          {/* Tombol Masuk Utama */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 font-bold text-sm rounded-lg shadow-sm transition duration-150 active:scale-[0.96] disabled:opacity-50 ${
              isAdminMode
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {loading
              ? 'Memproses...'
              : isAdminMode
              ? 'Masuk sebagai Admin'
              : 'Masuk sebagai Pengunjung'}
          </button>
        </form>

        {/* Tombol Alternatif Satu Pilihan (Switcher) */}
        <div className="mt-6 pt-5 border-t border-slate-700/60">
          <button
            type="button"
            onClick={toggleRole}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-700/60 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition duration-150 active:scale-[0.96]"
          >
            {isAdminMode ? (
              <>
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Atau Masuk sebagai Pengunjung
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Atau Masuk sebagai Admin
              </>
            )}
          </button>
        </div>

        {/* Link Daftar (hanya tampil di mode pengunjung) */}
        {!isAdminMode && (
          <p className="text-center text-xs text-slate-400 mt-5">
            Belum punya akun?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
              Daftar sebagai Pengunjung
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
