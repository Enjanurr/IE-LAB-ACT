import { useState } from 'react';

// Two-step delete: the first click asks, the second confirms. onConfirm returns true on success.
export default function ConfirmButton({ label, question, onConfirm }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return <button type="button" className="link danger" onClick={() => setAsking(true)}>{label}</button>;
  }

  const confirm = async () => {
    setBusy(true);
    const ok = await onConfirm();
    if (!ok) {
      setBusy(false);
      setAsking(false);
    }
  };

  return (
    <span className="confirm" role="group" aria-label={question}>
      <span>{question}</span>
      <button type="button" className="btn danger small" onClick={confirm} disabled={busy}>
        {busy ? 'Deleting…' : 'Yes, delete'}
      </button>
      <button type="button" className="btn secondary small" onClick={() => setAsking(false)} disabled={busy}>Cancel</button>
    </span>
  );
}
