import { Link, useParams } from 'react-router';
import { getCourse, getLesson } from '../data/courses.js';
import NotFoundState from '../components/NotFoundState.jsx';

export default function LessonDetails() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);

  if (!lesson) {
    return (
      <NotFoundState
        title="Lesson not found"
        message={`There is no lesson with the ID "${lessonId}".`}
        links={[{ to: '/dashboard', label: 'Back to dashboard' }, { to: '/courses', label: 'Browse courses' }]}
      />
    );
  }

  const course = getCourse(lesson.courseId);
  const index = course.lessonIds.indexOf(lesson.id);
  const prev = course.lessonIds[index - 1];
  const next = course.lessonIds[index + 1];

  return (
    <article className="panel">
      <p className="meta">
        <Link to={`/courses/${course.id}`}>{course.title}</Link> · Lesson {index + 1} of {course.lessonIds.length}
      </p>
      <h1>{lesson.title}</h1>
      <p className="muted">{lesson.minutes} minutes</p>
      <p>{lesson.content}</p>
      <div className="row">
        {prev && <Link className="btn secondary" to={`/dashboard/lessons/${prev}`}>&larr; Previous</Link>}
        {next && <Link className="btn" to={`/dashboard/lessons/${next}`}>Next &rarr;</Link>}
      </div>
    </article>
  );
}
