# Student Learning Portal

React Declarative Routing lab: Vite + React 18 + React Router v7 (Declarative Mode, everything imported from `react-router`).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build check
```

## Route tree

| Path | Page | Notes |
|------|------|-------|
| `/` | Home | index route of `MainLayout` |
| `/courses` | Courses | `?search=` and `?category=` live in the URL |
| `/courses/:courseId` | CourseDetails | friendly not-found state for unknown IDs |
| `/login` | Login | validates input, then `navigate(dest, { replace: true })` |
| `/dashboard` | Dashboard | protected, index route of `DashboardLayout` |
| `/dashboard/profile` | Profile | protected, nested |
| `/dashboard/lessons/:lessonId` | LessonDetails | protected, nested, not-found state |
| `*` | NotFound | intentional 404 |

## Structure

```
src/
  components/  ProtectedRoute, Breadcrumbs, CourseCard, NotFoundState, useDocumentTitle
  context/     AuthContext (user, login, logout)
  data/        courses.js (6 courses incl. COA101, 14 lessons)
  layouts/     MainLayout, DashboardLayout (both render <Outlet />)
  pages/       Home, Courses, CourseDetails, Login, Dashboard, Profile, LessonDetails, NotFound
```

## Try it

1. Open `/courses/COA101` directly: course page. `/courses/UNKNOWN`: friendly not-found.
2. Open `/courses?search=react&category=Programming`, refresh: filters stay. Reset Filters clears only those two keys.
3. Open `/dashboard/profile?tab=x#top` while logged out: redirected to `/login`; sign in and you return to the exact URL.
4. Footer shows "Document loaded at" and a route-change counter. Click around: the time never changes, the counter grows (no page reload).
5. Tab title changes on every route.

Login is a UI-only mock: any name, a valid-looking email and a 6+ character password. Only name and email are kept, in memory. Nothing is saved to localStorage, so a browser refresh signs you out. A client-side guard is not real authorization; a real API must check every request on the server.
