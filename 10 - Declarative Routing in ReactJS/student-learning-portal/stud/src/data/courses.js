export const courses = [
  {
    id: 'COA101',
    title: 'Computer Organization and Architecture',
    description:
      'How processors, memory and buses work together. Covers number systems, instruction cycles, caches and pipelines.',
    category: 'Computer Science',
    instructor: 'Dr. Maria Santos',
    lessonIds: ['L101', 'L102', 'L103'],
  },
  {
    id: 'REACT201',
    title: 'React Fundamentals',
    description:
      'Build interactive interfaces with components, props, state and hooks, then add client-side routing.',
    category: 'Programming',
    instructor: 'Prof. Jun Reyes',
    lessonIds: ['L201', 'L202', 'L203'],
  },
  {
    id: 'WEB110',
    title: 'Responsive Web Design',
    description:
      'Layouts with Flexbox and Grid, fluid typography, accessibility basics and mobile-first workflows.',
    category: 'Design',
    instructor: 'Ms. Ana Cruz',
    lessonIds: ['L301', 'L302'],
  },
  {
    id: 'DB220',
    title: 'Database Systems',
    description:
      'Relational modeling, SQL queries, normalization, indexes and an introduction to transactions.',
    category: 'Data',
    instructor: 'Engr. Paolo Lim',
    lessonIds: ['L401', 'L402'],
  },
  {
    id: 'NODE230',
    title: 'Node.js and REST APIs',
    description:
      'Design and build REST APIs with Express, validation, error handling and token-based authentication.',
    category: 'Programming',
    instructor: 'Prof. Jun Reyes',
    lessonIds: ['L501', 'L502'],
  },
  {
    id: 'SEC150',
    title: 'Cybersecurity Fundamentals',
    description:
      'Threat models, the CIA triad, secure authentication, common web vulnerabilities and safe habits.',
    category: 'Security',
    instructor: 'Dr. Carla Yu',
    lessonIds: ['L601', 'L602'],
  },
];

export const lessons = [
  { id: 'L101', courseId: 'COA101', title: 'Number Systems and Data Representation', minutes: 25, content: 'Binary, octal and hexadecimal notation, two\'s complement for signed integers, and how floating point values are stored.' },
  { id: 'L102', courseId: 'COA101', title: 'The Instruction Cycle', minutes: 30, content: 'Fetch, decode, execute and write back. How the program counter and registers drive each step.' },
  { id: 'L103', courseId: 'COA101', title: 'Memory Hierarchy and Caches', minutes: 35, content: 'Registers, cache levels, RAM and storage. Locality of reference, hit rate and replacement policies.' },
  { id: 'L201', courseId: 'REACT201', title: 'Components and Props', minutes: 20, content: 'Split a UI into components and pass data down with props. Keep components small and pure.' },
  { id: 'L202', courseId: 'REACT201', title: 'State and Effects', minutes: 30, content: 'useState for render-driven data, useEffect for synchronizing with the outside world, and cleanup functions.' },
  { id: 'L203', courseId: 'REACT201', title: 'Declarative Routing', minutes: 30, content: 'Map URLs to components with Routes and Route, share layouts with Outlet, and read the URL with hooks.' },
  { id: 'L301', courseId: 'WEB110', title: 'Flexbox and Grid', minutes: 25, content: 'One-dimensional versus two-dimensional layout, alignment, gaps and auto-fit grids.' },
  { id: 'L302', courseId: 'WEB110', title: 'Accessible Interfaces', minutes: 25, content: 'Semantic HTML, focus order, color contrast and keyboard navigation.' },
  { id: 'L401', courseId: 'DB220', title: 'Relational Modeling', minutes: 30, content: 'Entities, relationships, keys and entity-relationship diagrams translated into tables.' },
  { id: 'L402', courseId: 'DB220', title: 'SQL Queries and Joins', minutes: 35, content: 'SELECT, WHERE, GROUP BY and the different kinds of JOIN, with practice queries.' },
  { id: 'L501', courseId: 'NODE230', title: 'Routing in Express', minutes: 25, content: 'Define routes, parse JSON bodies and organize handlers into routers.' },
  { id: 'L502', courseId: 'NODE230', title: 'Authentication and Authorization', minutes: 35, content: 'Why the server must check every request, even when the client already hides the page.' },
  { id: 'L601', courseId: 'SEC150', title: 'The CIA Triad', minutes: 20, content: 'Confidentiality, integrity and availability, and how each is attacked and defended.' },
  { id: 'L602', courseId: 'SEC150', title: 'Common Web Vulnerabilities', minutes: 30, content: 'Injection, cross-site scripting, broken access control and how to prevent them.' },
];

export const getCourse = (id) => courses.find((c) => c.id === id);
export const getLesson = (id) => lessons.find((l) => l.id === id);
export const getCourseLessons = (course) =>
  course.lessonIds.map((id) => getLesson(id)).filter(Boolean);
export const categories = [...new Set(courses.map((c) => c.category))].sort();
