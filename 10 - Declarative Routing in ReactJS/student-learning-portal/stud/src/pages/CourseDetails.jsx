import { Link, useParams } from 'react-router';
import { getCourse, getCourseLessons } from '../data/courses.js';
import NotFoundState from '../components/NotFoundState.jsx';

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = getCourse(courseId);

  if (!course) {
    return (
      <NotFoundState
        title="Course not found"
        message={`There is no course with the ID "${courseId}".`}
        links={[{ to: '/courses', label: 'Browse all courses' }, { to: '/', label: 'Go home' }]}
      />
    );
  }

  const lessons = getCourseLessons(course);
  return (
    <article className="panel">
      <Link to="/courses" className="back">&larr; All courses</Link>
      <span className="pill">{course.category}</span>
      <h1>{course.title}</h1>
      <p className="meta">Course ID: {course.id} · Instructor: {course.instructor}</p>
      <p>{course.description}</p>
      <h2>Lessons</h2>
      <ol className="lesson-list">
        {lessons.map((l) => (
          <li key={l.id}>
            <Link to={`/dashboard/lessons/${l.id}`}>{l.title}</Link>
            <span className="muted"> · {l.minutes} min</span>
          </li>
        ))}
      </ol>
      <p className="muted small">Lessons open in your dashboard, so you will be asked to sign in first.</p>
    </article>
  );
}
