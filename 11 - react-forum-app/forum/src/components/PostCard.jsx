import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, isOwnedBy } from '../services/parsers.js';
import ConfirmButton from './ConfirmButton.jsx';
import ReplyForm from './ReplyForm.jsx';

export default function PostCard({ post, onDelete, onReply, onDeleteReply }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const canAct = post.id !== null;
  const count = post.replies.length;

  return (
    <article className="card post" data-testid="post">
      <header className="meta">
        <strong>{post.author || 'Unknown user'}</strong>
        {post.date && <time>{formatDate(post.date)}</time>}
      </header>
      <p className="content">{post.text}</p>

      <div className="actions">
        <button type="button" className="link" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide' : 'Show'} replies ({count})
        </button>
        {canAct && isOwnedBy(user, post) && (
          <ConfirmButton label="Delete post" question="Delete this post?" onConfirm={() => onDelete(post)} />
        )}
      </div>

      {open && (
        <div className="thread">
          {count === 0 && <p className="muted small">No replies yet.</p>}
          {post.replies.map((reply) => (
            <div className="reply" key={reply.key} data-testid="reply">
              <header className="meta">
                <strong>{reply.author || 'Unknown user'}</strong>
                {reply.date && <time>{formatDate(reply.date)}</time>}
              </header>
              <p className="content">{reply.text}</p>
              {reply.id !== null && isOwnedBy(user, reply) && (
                <ConfirmButton label="Delete reply" question="Delete this reply?" onConfirm={() => onDeleteReply(post, reply)} />
              )}
            </div>
          ))}
          {user && canAct && <ReplyForm onSubmit={(text) => onReply(post, text)} />}
          {!user && <p className="muted small">Log in to reply.</p>}
        </div>
      )}
    </article>
  );
}
