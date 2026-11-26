import { useEffect, useState } from 'react';

const USERS = [
  { id: 1, name: 'Ana Cruz', role: 'Developer' },
  { id: 2, name: 'Ben Lim', role: 'Designer' },
  { id: 3, name: 'Cara Yu', role: 'Tester' },
  { id: 4, name: 'Dan Go', role: 'Developer' },
];

const SEARCH_DELAY_MS = 500;

function SessionTimer({ onTick }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Functional update avoids the stale-closure bug (seconds stuck at 1),
    // and the empty dependency array means exactly one interval per mount.
    const intervalId = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  useEffect(() => {
    onTick(seconds);
  }, [seconds, onTick]);

  return <p className="counter" aria-live="off">{seconds}s</p>;
}

export default function LiveSearchTimer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(USERS);
  const [searching, setSearching] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerVisible, setTimerVisible] = useState(true);

  // Simulated search request. The effect depends on `query` only and updates a
  // DIFFERENT state value (`results`), so it cannot loop.
  useEffect(() => {
    setSearching(true);
    const timeoutId = setTimeout(() => {
      const needle = query.trim().toLowerCase();
      setResults(
        USERS.filter(
          (u) => u.name.toLowerCase().includes(needle) || u.role.toLowerCase().includes(needle)
        )
      );
      setSearching(false);
    }, SEARCH_DELAY_MS);

    // Cleanup runs before the next effect and on unmount: the previous pending
    // "request" is cancelled, so an outdated result can never be displayed.
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Synchronize the document title with result count (and elapsed seconds).
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${results.length} result${results.length === 1 ? '' : 's'} · ${elapsed}s`;
    return () => {
      document.title = previousTitle;
    };
  }, [results.length, elapsed]);

  return (
    <section aria-labelledby="exam2-title">
      <h2 id="exam2-title">Live Search and Timer</h2>
      <p className="lede">Type quickly: only the latest query produces a result.</p>

      <div className="field">
        <label htmlFor="user-search">Search users</label>
        <input
          id="user-search"
          type="search"
          value={query}
          placeholder="Try “dev”, “ana”, “tester”"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <p className="muted" role="status">
        {searching ? 'Searching…' : `${results.length} visible result${results.length === 1 ? '' : 's'}`}
      </p>

      <ul className="list">
        {!searching && results.length === 0 && <li>No users found.</li>}
        {results.map((u) => (
          <li key={u.id}>
            <span>{u.name}</span>
            <span className="pill">{u.role}</span>
          </li>
        ))}
      </ul>

      <h3>Session timer</h3>
      {timerVisible ? <SessionTimer onTick={setElapsed} /> : <p className="muted">Timer unmounted (interval cleared).</p>}
      <button
        className="btn secondary"
        onClick={() => {
          setTimerVisible((v) => !v);
          setElapsed(0);
        }}
      >
        {timerVisible ? 'Unmount timer' : 'Mount timer'}
      </button>

      <details>
        <summary>Debugging notes and cleanup explanation</summary>
        <ul className="muted">
          <li>Repeating effect: an effect that sets the same state it depends on re-runs forever. Here the search effect depends on <code>query</code> but writes <code>results</code>.</li>
          <li>Stuck timer: <code>setSeconds(seconds + 1)</code> in an interval created once captures <code>seconds = 0</code> forever. <code>setSeconds((s) =&gt; s + 1)</code> always uses the latest value.</li>
          <li>Search cleanup: <code>clearTimeout</code> cancels the previous delayed search when <code>query</code> changes or the component unmounts.</li>
          <li>Interval cleanup: <code>clearInterval</code> stops the timer on unmount so no duplicate timer keeps running after remount.</li>
        </ul>
      </details>
    </section>
  );
}
