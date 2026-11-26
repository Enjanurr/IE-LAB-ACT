import { useEffect, useReducer } from 'react';

function loadState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Basic shape check so corrupted storage cannot crash the app.
    if (parsed && Array.isArray(parsed.issues) && typeof parsed.nextId === 'number') {
      return { ...fallback, ...parsed };
    }
  } catch {
    // Ignore unreadable or blocked storage and fall back to defaults.
  }
  return fallback;
}

export function usePersistentReducer(reducer, initialState, storageKey) {
  // Lazy initializer: localStorage is read exactly once, on mount.
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => loadState(storageKey, initial));

  // Save after every state change.
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage may be full or disabled; the app keeps working in memory.
    }
  }, [state, storageKey]);

  return [state, dispatch];
}
