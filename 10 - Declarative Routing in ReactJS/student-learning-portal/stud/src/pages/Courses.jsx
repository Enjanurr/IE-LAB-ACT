import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { categories, courses } from '../data/courses.js';
import CourseCard from '../components/CourseCard.jsx';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? 'all';

  // Derived from the URL, so refresh, back/forward and shared links all work.
  // useMemo is optional with 6 courses; it only skips recomputing when the
  // search and category are unchanged but another query key or render changes.
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return courses.filter(
      (course) =>
        (course.title.toLowerCase().includes(needle) ||
          course.description.toLowerCase().includes(needle)) &&
        (category === 'all' || course.category === category)
    );
  }, [search, category]);

  // Copy the existing params so unrelated keys survive; touch only one key.
  const updateParam = (key, value, replace) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace });
  };

  const resetFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    next.delete('category');
    setSearchParams(next);
  };

  const hasFilters = search !== '' || category !== 'all';

  return (
    <>
      <h1>Courses</h1>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            value={search}
            placeholder="e.g. react"
            onChange={(e) => updateParam('search', e.target.value, true)}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => updateParam('category', e.target.value, false)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" className="btn secondary" onClick={resetFilters} disabled={!hasFilters}>
          Reset Filters
        </button>
      </form>

      <p className="muted" role="status">
        {filtered.length} of {courses.length} courses
      </p>

      {filtered.length === 0 ? (
        <div className="panel">
          <h2>No courses match your filters</h2>
          <p className="muted">Try a different keyword or category, or clear the filters.</p>
          <button type="button" className="btn" onClick={resetFilters}>Reset Filters</button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </>
  );
}
