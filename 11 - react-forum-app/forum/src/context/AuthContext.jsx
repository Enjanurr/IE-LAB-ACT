import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as forumApi from '../services/forumApi.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'forum-session';

// Only the user id and display name are kept (never the password), and only for this tab.
function readSession() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.id !== undefined && parsed.id !== null ? parsed : null;
  } catch {
    return null;
  }
}

function writeSession(user) {
  try {
    if (user) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: the session just lasts until the page reloads */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const start = useCallback((nextUser) => {
    setUser(nextUser);
    writeSession(nextUser);
    return nextUser;
  }, []);

  const signIn = useCallback(async (credentials) => start(await forumApi.login(credentials)), [start]);
  const signUp = useCallback(async (credentials) => start(await forumApi.createUser(credentials)), [start]);
  const signOut = useCallback(() => start(null), [start]);

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.');
  return ctx;
}
