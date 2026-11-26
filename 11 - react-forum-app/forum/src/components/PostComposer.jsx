import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function PostComposer({ onSubmit, onLogin }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <section className="card prompt">
        <p>
          <button type="button" className="link" onClick={onLogin}>Log in</button> to write a post or reply.
        </p>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setBusy(true);
    const ok = await onSubmit(value);
    setBusy(false);
    if (ok) setText('');
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label htmlFor="new-post" className="label">What is on your mind, {user.username}?</label>
      <textarea id="new-post" rows={3} value={text} onChange={(e) => setText(e.target.value)} disabled={busy} placeholder="Write a post…" />
      <div className="row end">
        <button type="submit" className="btn" disabled={busy || text.trim() === ''}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}
