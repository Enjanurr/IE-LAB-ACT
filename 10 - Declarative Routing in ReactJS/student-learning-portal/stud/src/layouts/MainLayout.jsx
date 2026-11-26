import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import useDocumentTitle from '../components/useDocumentTitle.js';

// Set once when the JS bundle loads. A full page reload would create a new
// value; client-side navigation never does.
const DOCUMENT_LOADED_AT = new Date().toLocaleTimeString();

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useDocumentTitle();

  // Counts route transitions. Comparing location.key keeps it StrictMode-safe.
  const lastKey = useRef(location.key);
  const [transitions, setTransitions] = useState(0);
  useEffect(() => {
    if (lastKey.current !== location.key) {
      lastKey.current = location.key;
      setTransitions((n) => n + 1);
    }
  }, [location.key]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" end className="brand">
          Student Learning Portal
        </NavLink>
        <nav aria-label="Main">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/courses" className={linkClass}>Courses</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          {user ? (
            <button type="button" className="nav-link as-button" onClick={handleLogout}>
              Log out ({user.name})
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer" data-testid="reload-proof">
        <span>Document loaded at <strong data-testid="loaded-at">{DOCUMENT_LOADED_AT}</strong></span>
        <span>Route changes since load: <strong data-testid="transitions">{transitions}</strong></span>
        <span className="muted">(A full reload would reset both.)</span>
      </footer>
    </div>
  );
}
