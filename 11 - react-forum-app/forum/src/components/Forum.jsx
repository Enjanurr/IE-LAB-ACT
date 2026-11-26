import { useCallback, useEffect, useState } from 'react';
import { FIRST_PAGE } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotice } from '../context/NoticeContext.jsx';
import usePosts from '../hooks/usePosts.js';
import * as forumApi from '../services/forumApi.js';
import AuthModal from './AuthModal.jsx';
import Banner from './Banner.jsx';
import Header from './Header.jsx';
import Pagination from './Pagination.jsx';
import PostCard from './PostCard.jsx';
import PostComposer from './PostComposer.jsx';

export default function Forum() {
  const { user } = useAuth();
  const { notify } = useNotice();
  const [page, setPage] = useState(FIRST_PAGE);
  const [lastPage, setLastPage] = useState(null); // known once a page comes back empty
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'
  const { posts, status, error, loadedPage, reload, setPosts } = usePosts(page);

  // An empty page after the first means we ran past the end: step back and remember it.
  useEffect(() => {
    if (status === 'ready' && loadedPage === page && posts.length === 0 && page > FIRST_PAGE) {
      setLastPage(page - 1);
      setPage(page - 1);
      notify('info', 'You have reached the last page.');
    }
  }, [status, loadedPage, page, posts.length, notify]);

  const hasNext = status === 'ready' && posts.length > 0 && (lastPage === null || page < lastPage);

  // Every action returns true/false so the form or button that started it knows the outcome.
  const run = useCallback(
    async (action, successMessage) => {
      try {
        await action();
        if (successMessage) notify('success', successMessage);
        return true;
      } catch (err) {
        if (err.name !== 'AbortError') notify('error', err.message);
        return false;
      }
    },
    [notify]
  );

  const handleCreatePost = (text) =>
    run(async () => {
      await forumApi.createPost({ userId: user.id, post: text });
      setLastPage(null);
      if (page === FIRST_PAGE) reload();
      else setPage(FIRST_PAGE);
    }, 'Your post was published.');

  const handleDeletePost = (post) =>
    run(async () => {
      await forumApi.deletePost(post.id);
      setPosts((list) => list.filter((p) => p.key !== post.key));
      reload(true);
    }, 'Post deleted.');

  const handleReply = (post, text) =>
    run(async () => {
      await forumApi.replyToPost({ userId: user.id, postId: post.id, reply: text });
      reload(true);
    }, 'Reply added.');

  const handleDeleteReply = (post, reply) =>
    run(async () => {
      await forumApi.deleteReply(reply.id);
      setPosts((list) =>
        list.map((p) => (p.key === post.key ? { ...p, replies: p.replies.filter((r) => r.key !== reply.key) } : p))
      );
      reload(true);
    }, 'Reply deleted.');

  return (
    <div className="app">
      <Header onOpenAuth={setAuthMode} />
      <Banner />

      <main>
        <PostComposer onSubmit={handleCreatePost} onLogin={() => setAuthMode('login')} />

        <section aria-label="Posts" aria-busy={status === 'loading'}>
          <div className="feed-heading">
            <p className="eyebrow">The community</p>
            <h2>Forum posts</h2>
          </div>

          {status === 'loading' && <p className="state" role="status">Loading posts…</p>}

          {status === 'error' && (
            <div className="state error-state" role="alert">
              <p>{error}</p>
              <button type="button" className="btn" onClick={() => reload()}>Try again</button>
            </div>
          )}

          {status === 'ready' && posts.length === 0 && page === FIRST_PAGE && (
            <p className="state">No posts yet. Be the first to write one.</p>
          )}

          {status === 'ready' &&
            posts.map((post) => (
              <PostCard
                key={post.key}
                post={post}
                onDelete={handleDeletePost}
                onReply={handleReply}
                onDeleteReply={handleDeleteReply}
              />
            ))}
        </section>

        <Pagination
          page={page}
          firstPage={FIRST_PAGE}
          hasNext={hasNext}
          disabled={status === 'loading'}
          onPrev={() => setPage((p) => Math.max(FIRST_PAGE, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </main>

      {authMode && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />}
    </div>
  );
}
