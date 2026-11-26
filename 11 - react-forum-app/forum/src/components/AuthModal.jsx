import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotice } from '../context/NoticeContext.jsx';

export default function AuthModal({ mode, onModeChange, onClose }) {
  const { signIn, signUp } = useAuth();
  const { notify } = useNotice();
  const dialogRef = useRef(null);
  const [form, setForm] = useState({ username: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isLogin = mode === 'login';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const switchMode = (next) => {
    setError('');
    onModeChange(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { username: form.username.trim(), password: form.password.trim() };
    if (!credentials.username || !credentials.password) {
      setError('Enter both your first name and your last name.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const user = await (isLogin ? signIn : signUp)(credentials);
      notify('success', isLogin ? `Welcome back, ${user.username}.` : `Account created. You are signed in as ${user.username}.`);
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="auth-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form onSubmit={handleSubmit} noValidate className="modal-body">
        <div className="tabs" role="tablist" aria-label="Account">
          <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? 'tab active' : 'tab'} onClick={() => switchMode('login')}>
            Log in
          </button>
          <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? 'tab active' : 'tab'} onClick={() => switchMode('register')}>
            Register
          </button>
        </div>

        <h2 id="auth-title">{isLogin ? 'Log in' : 'Create an account'}</h2>

        <div className="field">
          <label htmlFor="auth-username">First name (username)</label>
          <input id="auth-username" name="username" type="text" autoComplete="off" value={form.username} onChange={handleChange} disabled={busy} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="auth-password">Last name (password)</label>
          <input id="auth-password" name="password" type="password" autoComplete="off" value={form.password} onChange={handleChange} disabled={busy} />
        </div>

        {error && <p className="field-error" role="alert">{error}</p>}

        <div className="row end">
          <button type="button" className="btn secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="btn" disabled={busy}>
            {busy ? (isLogin ? 'Logging in…' : 'Creating…') : isLogin ? 'Log in' : 'Register'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
