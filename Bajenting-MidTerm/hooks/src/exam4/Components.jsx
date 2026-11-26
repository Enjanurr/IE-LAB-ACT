import { FONT_SIZES, usePreferences } from './PreferencesContext.jsx';

export function Toolbar() {
  const { theme, toggleTheme } = usePreferences();
  return (
    <div className="toolbar">
      <strong>Toolbar</strong>
      <button className="btn secondary" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        Theme: {theme}
      </button>
    </div>
  );
}

export function PreferencesPanel() {
  const { fontSize, setFontSize } = usePreferences();
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Preferences panel</h3>
      <div className="row" role="group" aria-label="Font size">
        {FONT_SIZES.map((size) => (
          <button
            key={size}
            className="btn secondary"
            aria-pressed={fontSize === size}
            onClick={() => setFontSize(size)}
            style={fontSize === size ? { outline: '2px solid var(--accent)' } : undefined}
          >
            {size}px
          </button>
        ))}
      </div>
    </div>
  );
}

export function ArticlePreview() {
  const { theme, fontSize } = usePreferences();
  return (
    <article className="card" style={{ fontSize }}>
      <h3 style={{ marginTop: 0, fontSize: '1.2em' }}>Article preview</h3>
      <p>
        Context lets distant components read shared values directly. This text follows the selected
        font size ({fontSize}px) and the {theme} theme without receiving a single preference prop.
      </p>
    </article>
  );
}

export function Dashboard({ children }) {
  const { theme, fontSize } = usePreferences();
  return (
    <div className="dashboard" data-theme={theme} style={{ fontSize }}>
      <h3 style={{ marginTop: 0 }}>Dashboard</h3>
      {children}
    </div>
  );
}
