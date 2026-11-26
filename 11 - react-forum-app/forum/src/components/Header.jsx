import { useAuth } from '../context/AuthContext.jsx';
import { useNotice } from '../context/NoticeContext.jsx';

export default function Header({ onOpenAuth }) {
  const { user, signOut } = useAuth();
  const { notify } = useNotice();

  return (
    <header className="header">
      <div className="brand">
        <h1>Forum</h1>
        <p className="tagline">Share ideas and join the conversation.</p>
      </div>
      <div className="session" aria-live="polite">
        {user ? (
          <>
            <span data-testid="session-status">Signed in as <strong>{user.username}</strong></span>
            <button
              type="button"
              className="btn secondary small"
              onClick={() => {
                signOut();
                notify('info', 'You have been logged out.');
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <span data-testid="session-status" className="muted">Not signed in</span>
            <button type="button" className="btn small" onClick={() => onOpenAuth('login')}>Log in</button>
            <button type="button" className="btn secondary small" onClick={() => onOpenAuth('register')}>Register</button>
          </>
        )}
      </div>
    </header>
  );
}
