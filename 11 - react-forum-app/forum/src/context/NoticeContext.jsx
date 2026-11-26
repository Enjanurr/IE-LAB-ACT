import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const NoticeContext = createContext(null);

// One banner at a time. Success and info messages fade out; errors stay until dismissed.
export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const timer = useRef(null);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setNotice(null);
  }, []);

  const notify = useCallback((type, message) => {
    clearTimeout(timer.current);
    setNotice({ type, message, id: Date.now() });
    if (type !== 'error') timer.current = setTimeout(() => setNotice(null), 4500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ notice, notify, dismiss }), [notice, notify, dismiss]);
  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>;
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error('useNotice must be used inside <NoticeProvider>.');
  return ctx;
}
