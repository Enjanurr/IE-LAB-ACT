import { createContext, useContext, useState } from 'react';

// ONE context object, exported from ONE module. Every consumer imports this same object.
export const PreferencesContext = createContext(null);

export const FONT_SIZES = [14, 16, 18];

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = { theme, fontSize, toggleTheme, setFontSize };
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === null) {
    throw new Error('usePreferences must be used inside a <PreferencesProvider>.');
  }
  return context;
}
