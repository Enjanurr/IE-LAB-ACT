import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

// UI-only mock. Only a display name and email are kept, in memory.
// Nothing is written to localStorage and no password is ever stored.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(({ name, email }) => {
    setUser({ name: name.trim(), email: email.trim(), signedInAt: new Date() });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
