import { Link, matchPath, useLocation } from 'react-router';
import { getLesson } from '../data/courses.js';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Dashboard', to: '/dashboard' }];

  if (pathname === '/dashboard/profile') {
    crumbs.push({ label: 'Profile' });
  } else {
    const match = matchPath('/dashboard/lessons/:lessonId', pathname);
    if (match) {
      // /dashboard/lessons has no page of its own, so "Lessons" is plain text.
      crumbs.push({ label: 'Lessons' });
      crumbs.push({ label: getLesson(match.params.lessonId)?.title ?? 'Unknown lesson' });
    }
  }
  // The last crumb is the current page: shown as text, not as a link.
  crumbs[crumbs.length - 1] = { label: crumbs[crumbs.length - 1].label };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumbs">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
            {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
