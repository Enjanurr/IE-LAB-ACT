import { useCallback, useEffect, useState } from 'react';
import { getPosts } from '../services/forumApi.js';

// Loads one page of posts. `reload(true)` refreshes quietly (no loading flash).
// `loadedPage` says which page the current data belongs to.
export default function usePosts(page) {
  const [state, setState] = useState({ posts: [], status: 'loading', error: '', loadedPage: null });
  const [tick, setTick] = useState({ n: 0, silent: false });

  useEffect(() => {
    const controller = new AbortController();
    if (!tick.silent) setState((s) => ({ ...s, status: 'loading', error: '' }));

    getPosts(page, { signal: controller.signal })
      .then((posts) => setState({ posts, status: 'ready', error: '', loadedPage: page }))
      .catch((error) => {
        if (error.name === 'AbortError') return; // a newer request replaced this one
        if (tick.silent) return; // keep showing what we have
        setState((s) => ({ ...s, status: 'error', error: error.message }));
      });

    return () => controller.abort();
  }, [page, tick]);

  const reload = useCallback((silent = false) => setTick((t) => ({ n: t.n + 1, silent })), []);
  const setPosts = useCallback(
    (update) => setState((s) => ({ ...s, posts: typeof update === 'function' ? update(s.posts) : update })),
    []
  );

  return { ...state, reload, setPosts };
}
