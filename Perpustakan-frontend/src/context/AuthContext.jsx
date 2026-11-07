import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('melani_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('melani_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getProfile(token)
        .then((res) => {
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('melani_user', JSON.stringify(res.data));
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('melani_token', newToken);
    localStorage.setItem('melani_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('melani_token');
    localStorage.removeItem('melani_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
