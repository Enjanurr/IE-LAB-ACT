import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router';
import { getCourse, getLesson } from '../data/courses.js';

const APP = 'Student Learning Portal';

function titleFor(pathname) {
  if (pathname === '/') return 'Home';
  if (pathname === '/courses') return 'Courses';
  if (pathname === '/login') return 'Sign in';
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/dashboard/profile') return 'Profile';

  const course = matchPath('/courses/:courseId', pathname);
  if (course) {
    const found = getCourse(course.params.courseId);
    return found ? found.title : 'Course not found';
  }
  const lesson = matchPath('/dashboard/lessons/:lessonId', pathname);
  if (lesson) {
    const found = getLesson(lesson.params.lessonId);
    return found ? found.title : 'Lesson not found';
  }
  return 'Page not found';
}

// Route-aware effect: runs after every pathname change and writes to the
// document, which is a side effect outside React, so useEffect fits.
export default function useDocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${titleFor(pathname)} | ${APP}`;
  }, [pathname]);
}
