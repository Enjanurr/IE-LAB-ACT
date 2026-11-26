import { Link } from 'react-router';
import { courses } from '../data/courses.js';
import CourseCard from '../components/CourseCard.jsx';

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Learn at your own pace</h1>
        <p className="muted">
          Browse courses, filter them with shareable URLs, and track your lessons from a personal dashboard.
        </p>
        <div className="row">
          <Link className="btn" to="/courses">Browse courses</Link>
          <Link className="btn secondary" to="/dashboard">Go to dashboard</Link>
        </div>
      </section>
      <h2>Featured courses</h2>
      <div className="grid">
        {courses.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </>
  );
}
