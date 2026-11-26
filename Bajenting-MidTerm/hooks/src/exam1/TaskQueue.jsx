import { useState } from 'react';

const INITIAL_TARGET = 5;

// Status is DERIVED from state during render. No separate status state.
function getStatus(count, target) {
  if (count >= target) return 'Target reached';
  if (count === 0) return 'Not started';
  return 'In progress';
}

export default function SmartTaskCounter() {
  const [count, setCount] = useState(0);
  // Keep raw input string so typing/clearing works smoothly
  const [targetInput, setTargetInput] = useState(String(INITIAL_TARGET));

  // Parse target safely: fallback to 1 if input is empty or invalid
  const parsedTarget = parseInt(targetInput, 10);
  const target = Number.isNaN(parsedTarget) || parsedTarget < 1 ? 1 : Math.min(999, parsedTarget);

  const status = getStatus(count, target);
  const atTarget = count >= target;
  const remaining = Math.max(0, target - count);
  const percent = Math.min(100, Math.round((count / target) * 100));

  const increment = () => setCount((c) => Math.min(c + 1, target));
  const decrement = () => setCount((c) => Math.max(0, c - 1));
  const reset = () => setCount(0);

  // Two QUEUED functional updates. Each receives the result of the previous one,
  // so one click adds exactly two (clamped so it can never pass the target).
  const addTwo = () => {
    setCount((c) => Math.min(c + 1, target));
    setCount((c) => Math.min(c + 1, target));
  };

  // Intentionally broken handler from the exam, kept for the debugging demo only.
  const buggyAddTwo = () => {
    setCount(count + 1);
    setCount(count + 1);
  };

  // Updates the input string immediately so the UI denominator reflects whatever is typed
  const handleTargetChange = (e) => {
    setTargetInput(e.target.value);
  };

  const statusClass = status.toLowerCase().replace(' ', '-');

  return (
    <section aria-labelledby="exam1-title">
      <h2 id="exam1-title">Smart Task Counter</h2>
      <p className="lede">Track completed tasks for a study session.</p>

      <div className="field" style={{ maxWidth: 200 }}>
        <label htmlFor="target">Target tasks</label>
        <input
          id="target"
          type="number"
          min="1"
          max="999"
          value={targetInput}
          onChange={handleTargetChange}
        />
      </div>

      {/* Denominator dynamically updates on every keystroke in the input field */}
      <div className="counter" aria-live="polite" data-testid="count">
        {count}/{targetInput === '' ? 0 : target}
      </div>
      <span className={`status ${statusClass}`} data-testid="status">{status}</span>

      <div className="progress" aria-hidden="true">
        <div style={{ width: `${percent}%` }} />
      </div>

      {/* Detailed task status output */}
      <p className="muted">
        {count} of {target} tasks completed ({remaining} remaining)
      </p>

      <div className="row">
        <button className="btn" onClick={increment} disabled={atTarget}>Increment</button>
        <button className="btn" onClick={addTwo} disabled={atTarget}>Plus two</button>
        <button className="btn secondary" onClick={decrement} disabled={count === 0}>Decrement</button>
        <button className="btn secondary" onClick={reset}>Reset</button>
      </div>

      <details>
        <summary>Debugging case: why the original addTwo adds only one</summary>
        <p className="muted">
          <code>setCount(count + 1)</code> twice reads the same captured <code>count</code> from the
          render in which the handler was created. Both calls queue "set to count + 1" (the same
          number), so the second overwrites the first with an identical value. The fix is to pass an
          updater function, <code>setCount((c) =&gt; c + 1)</code>, which React runs against the latest
          queued value.
        </p>
        <button className="btn secondary" onClick={buggyAddTwo}>Buggy +2 (demo, adds only 1)</button>
      </details>
    </section>
  );
}