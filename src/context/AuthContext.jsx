import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from '../hooks/useAuth';

function getUser() {
  try { return authService().getUser(); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const login = async (input) => { const profile = authService().login(input); setUser(profile); };
  const register = async (input) => { const profile = authService().register(input); setUser(profile); };
  const logout = () => { authService().logout(); setUser(null); };
  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, register, logout }}>{children}</AuthContext.Provider>;
}
