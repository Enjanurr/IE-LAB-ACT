import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { courses } from '../data/courses.js';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="panel">
      <h1>Welcome back, {user.name}</h1>
      <p className="muted">Pick up where you left off.</p>
      <div className="grid">
        {courses.slice(0, 3).map((c) => (
          <article className="card" key={c.id}>
            <h3>{c.title}</h3>
            <Link to={`/dashboard/lessons/${c.lessonIds[0]}`}>Start first lesson</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
