# React Hooks Midterm Practical

Vite + React 18 app covering all six exam modules. Native React Hooks only; no state management library.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # reducer tests (Node's built-in test runner, no extra dependency)
npm run build    # production build check
```

## Completed requirements

| # | Module | Hooks | Where |
|---|--------|-------|-------|
| 1 | Smart Task Counter | `useState` | `src/exam1/TaskQueue.jsx` |
| 2 | Live Search and Timer | `useEffect`, `useState` | `src/exam2/LiveSearchTimer.jsx` |
| 3 | Accessible Form Toolkit | `useRef`, `useState` | `src/exam3/AccessibleFormToolkit.jsx` |
| 4 | Application Preferences | `useContext`, `useState` | `src/exam4/` |
| 5 | Product Explorer Performance Repair | `useMemo`, `useCallback`, `React.memo` | `src/exam5/ProductExplorer.jsx` |
| 6 | Issue Tracker State Engine | `useReducer`, custom Hook | `src/exam6/` |

- **1:** count/target state, Increment/Decrement/Reset (never below zero), plus two via two queued functional updates, status derived (no status state), Increment and plus two disabled at target.
- **2:** local `USERS` data, delayed search with `clearTimeout` cleanup, 1 s interval with `clearInterval` cleanup, `document.title` synced to result count and elapsed seconds, button to unmount/remount the timer.
- **3:** controlled name/email/password, one ref per input, validation messages, focus order name, email, password, previous email tracked in a ref.
- **4:** single exported context, provider, `usePreferences` that throws outside the provider, light/dark theme, 14/16/18 px font size, no preference props.
- **5:** 600 generated products, search/category/price sort, `useMemo` list, `useCallback` selection, `React.memo` `ProductList`, unrelated counter, render and recomputation badges plus console logs, analytics in `useEffect`.
- **6:** pure immutable reducer with all five actions and a safe default branch, `usePersistentReducer` (lazy load once, save on change), All/Open/Done views with counts, 4 reducer tests.

## Debugging explanations (each also inside a "Debugging" panel in the app)

- **Exam 1:** `setCount(count + 1)` twice reads the same captured `count`, so both calls queue the same value. Functional updates run against the latest queued value.
- **Exam 2:** an effect must not depend on state it sets; an interval capturing `seconds` stays at 1, so use `setSeconds((s) => s + 1)`. Cleanups cancel the pending search and stop the interval.
- **Exam 3:** mutating `ref.current` schedules no render, so visible data belongs in state.
- **Exam 4:** no provider gives only the default value; two separate `createContext` calls never connect; context removes intermediate props because descendants read the nearest provider.
- **Exam 5:** missing dependencies cause stale results or outdated callbacks; side effects like analytics move from `useMemo` to `useEffect`.
- **Exam 6:** replace mutation with new objects; keep `action.payload` consistent; the default branch returns `state`.

## Memoization that would be unnecessary (Exam 5)

Wrapping a trivial calculation, such as formatting a single price string, in `useMemo` costs more (dependency comparison and cached memory) than recomputing it. Likewise `useCallback` for a handler given to a plain DOM element or a non-memoized child saves nothing.

## Test steps

1. **Exam 1:** target 5. Count 4 then Plus two gives 5 (clamped) and both buttons disable. Decrement at 0 stays 0. Reset returns to 0.
2. **Exam 2:** type quickly; only the final query's results appear after about 0.5 s. The tab title shows the count and seconds. Unmount and mount the timer; it restarts without doubling speed.
3. **Exam 3:** submit empty to focus Name; fill name only to focus Email; fill both with a short password to focus Password. Submit two valid registrations; the second shows the first email as previous.
4. **Exam 4:** toggle theme and font size; all panels update. Open the debugging section and show the outside-provider consumer to see the error message.
5. **Exam 5:** open the browser console. Click the unrelated counter; "ProductList render" does not log and the badge stays. Change search/category/sort; it re-renders and the recomputation badge increases.
6. **Exam 6:** add, toggle, delete, filter, clear done; reload the page and the state remains. Run `npm test`.

## Known limitations

- Plus two clamps to the target (for example 4 + 2 gives 5) instead of exceeding it.
- Only the first 100 product rows are rendered for readability; filtering and sorting still cover all 600.
- Persistence uses `localStorage`; if storage is blocked the tracker works in memory only.
- React `StrictMode` runs effects twice in development, so some console logs and the render badge may count double in `npm run dev`.
