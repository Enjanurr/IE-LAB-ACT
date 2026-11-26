import { Link } from 'react-router';

// Reusable friendly "unknown id" state with navigation out.
export default function NotFoundState({ title, message, links }) {
  return (
    <section className="panel" role="alert">
      <h1>{title}</h1>
      <p className="muted">{message}</p>
      <div className="row">
        {links.map((l) => (
          <Link key={l.to} className="btn secondary" to={l.to}>
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
