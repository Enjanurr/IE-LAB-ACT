import { Component, useState } from 'react';
import { PreferencesProvider, usePreferences } from './PreferencesContext.jsx';
import { ArticlePreview, Dashboard, PreferencesPanel, Toolbar } from './Components.jsx';

// Calls the hook with NO provider above it, to demonstrate the clear error.
function OrphanConsumer() {
  usePreferences();
  return null;
}

class ErrorCatcher extends Component {
  state = { message: null };
  static getDerivedStateFromError(error) {
    return { message: error.message };
  }
  render() {
    if (this.state.message) {
      return <p className="error" role="alert">Caught: {this.state.message}</p>;
    }
    return this.props.children;
  }
}

export default function ApplicationPreferences() {
  const [showOrphan, setShowOrphan] = useState(false);

  return (
    <section aria-labelledby="exam4-title">
      <h2 id="exam4-title">Application Preferences</h2>
      <p className="lede">
        Tree: App → PreferencesProvider → Dashboard → Toolbar, PreferencesPanel, ArticlePreview.
      </p>

      <PreferencesProvider>
        <Dashboard>
          <Toolbar />
          <PreferencesPanel />
          <ArticlePreview />
        </Dashboard>
      </PreferencesProvider>

      <details>
        <summary>Debugging notes</summary>
        <ul className="muted">
          <li>No provider: <code>useContext</code> returns the default value (<code>null</code> here), so consumers break. <code>usePreferences</code> throws a clear error instead.</li>
          <li>Two context objects: a provider and consumer that import different <code>createContext</code> results never connect. Keep one exported context object.</li>
          <li>Why no intermediate props: any descendant calls <code>usePreferences()</code> and reads the nearest provider value, so Dashboard, Toolbar and the rest need no preference props.</li>
        </ul>
        <button className="btn secondary" onClick={() => setShowOrphan((v) => !v)}>
          {showOrphan ? 'Hide' : 'Show'} consumer outside the provider (demo)
        </button>
        {showOrphan && (
          <ErrorCatcher>
            <OrphanConsumer />
          </ErrorCatcher>
        )}
      </details>
    </section>
  );
}
