import { useMemo, useState } from 'react';
import { FILTERS, initialIssueState, issueReducer } from './issueReducer.js';
import { usePersistentReducer } from './usePersistentReducer.js';

const STORAGE_KEY = 'issue-tracker-state-v1';

export default function IssueTracker() {
  const [state, dispatch] = usePersistentReducer(issueReducer, initialIssueState, STORAGE_KEY);
  const [title, setTitle] = useState('');

  const counts = useMemo(() => {
    const done = state.issues.filter((i) => i.done).length;
    return { all: state.issues.length, done, open: state.issues.length - done };
  }, [state.issues]);

  const visibleIssues = useMemo(() => {
    if (state.filter === 'open') return state.issues.filter((i) => !i.done);
    if (state.filter === 'done') return state.issues.filter((i) => i.done);
    return state.issues;
  }, [state.issues, state.filter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: 'ADD_ISSUE', payload: { title } });
    setTitle('');
  };

  return (
    <section aria-labelledby="exam6-title">
      <h2 id="exam6-title">Issue Tracker State Engine</h2>
      <p className="lede">Pure reducer plus a persistent custom Hook (saved in localStorage).</p>

      <form onSubmit={handleSubmit} className="row">
        <label htmlFor="issue-title" style={{ position: 'absolute', left: -9999 }}>Issue title</label>
        <input
          id="issue-title"
          type="text"
          value={title}
          placeholder="Describe a new issue"
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: '1 1 240px', width: 'auto' }}
        />
        <button className="btn" type="submit">Add issue</button>
      </form>

      <div className="filter-bar" role="group" aria-label="Filter issues">
        {FILTERS.map((f) => (
          <button
            key={f}
            className="btn secondary"
            aria-pressed={state.filter === f}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: f } })}
          >
            {f[0].toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      <ul className="list">
        {visibleIssues.length === 0 && <li className="muted">No issues in this view.</li>}
        {visibleIssues.map((issue) => (
          <li key={issue.id}>
            <label className="row" style={{ flex: 1 }}>
              <input
                type="checkbox"
                checked={issue.done}
                onChange={() => dispatch({ type: 'TOGGLE_ISSUE', payload: { id: issue.id } })}
              />
              <span className={issue.done ? 'done-title' : undefined}>#{issue.id} {issue.title}</span>
            </label>
            <button
              className="btn danger"
              onClick={() => dispatch({ type: 'DELETE_ISSUE', payload: { id: issue.id } })}
              aria-label={`Delete issue ${issue.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn secondary" onClick={() => dispatch({ type: 'CLEAR_DONE' })} disabled={counts.done === 0}>
          Clear done ({counts.done})
        </button>
      </div>

      <details>
        <summary>Debugging notes</summary>
        <ul className="muted">
          <li>Mutation: reducers must return new state and new issue objects (<code>{'{ ...issue, done: !issue.done }'}</code>), never edit existing ones.</li>
          <li>Action shape: dispatch and reducer must agree. This app always sends <code>{'{ type, payload }'}</code> and the reducer reads <code>action.payload</code>.</li>
          <li>Default branch: returns <code>state</code>, never <code>undefined</code>, which would wipe the state.</li>
        </ul>
      </details>
    </section>
  );
}
