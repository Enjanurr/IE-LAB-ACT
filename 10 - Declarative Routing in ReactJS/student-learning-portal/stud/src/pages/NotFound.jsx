import { Link, useLocation } from 'react-router';

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <section className="panel" role="alert">
      <h1>404 · Page not found</h1>
      <p className="muted">
        Nothing lives at <code>{pathname}</code>.
      </p>
      <div className="row">
        <Link className="btn" to="/">Go home</Link>
        <Link className="btn secondary" to="/courses">Browse courses</Link>
      </div>
    </section>
  );
}
