import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { courses } from '../data/courses.js';

const linkClass = ({ isActive }) => (isActive ? 'side-link active' : 'side-link');

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dash">
      <aside className="sidebar" aria-label="Dashboard menu">
        <p className="muted small">Signed in as <strong>{user.name}</strong></p>
        <NavLink to="/dashboard" end className={linkClass}>Overview</NavLink>
        <NavLink to="/dashboard/profile" className={linkClass}>Profile</NavLink>
        <p className="side-heading">Lessons</p>
        {courses.slice(0, 2).flatMap((c) =>
          c.lessonIds.map((id) => (
            <NavLink key={id} to={`/dashboard/lessons/${id}`} className={linkClass}>
              {id}
            </NavLink>
          ))
        )}
        <button type="button" className="btn secondary" onClick={handleLogout}>Log out</button>
      </aside>

      <section className="dash-main">
        <div className="dash-bar">
          <Breadcrumbs />
          <code data-testid="pathname">{location.pathname}</code>
        </div>
        {/* Outlet is where the matched child route (index, profile, lesson) renders. */}
        <Outlet />
      </section>
    </div>
  );
}
