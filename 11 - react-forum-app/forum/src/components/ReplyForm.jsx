import { useId, useState } from 'react';

export default function ReplyForm({ onSubmit }) {
  const id = useId();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

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
    <form className="reply-form" onSubmit={handleSubmit}>
      <label htmlFor={id} className="sr-only">Write a reply</label>
      <input id={id} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply…" disabled={busy} />
      <button type="submit" className="btn small" disabled={busy || text.trim() === ''}>{busy ? 'Sending…' : 'Reply'}</button>
    </form>
  );
}
