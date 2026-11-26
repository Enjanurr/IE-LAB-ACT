import { Link } from 'react-router';

export default function CourseCard({ course }) {
  return (
    <article className="card">
      <span className="pill">{course.category}</span>
      <h3>
        <Link to={`/courses/${course.id}`}>{course.title}</Link>
      </h3>
      <p className="muted">{course.description}</p>
      <p className="meta">
        {course.instructor} · {course.lessonIds.length} lessons
      </p>
    </article>
  );
}
