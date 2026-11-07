import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-white font-semibold text-lg tracking-tight group">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group-hover:bg-emerald-500/20 transition duration-150">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <span>Perpustakaan</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition duration-150"
          >
            Katalog
          </Link>

          {user ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg transition duration-150 active:scale-[0.96]"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  to="/my-books"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition duration-150 active:scale-[0.96]"
                >
                  Buku Saya
                </Link>
              )}

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <div className="flex items-center gap-2 pl-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-slate-700 text-slate-300">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition duration-150 active:scale-[0.96]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800 transition duration-150 active:scale-[0.96]"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-1.5 rounded-lg font-semibold shadow-sm transition duration-150 active:scale-[0.96]"
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
