import { useState } from 'react';
import { checkWin } from '../api.js';

export default function TokenChecker({ onResult }) {
  const [token, setToken] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null); // null | 'win' | 'no'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = token.trim();
    if (!value) return;

    setChecking(true);
    setResult(null);
    try {
      const won = await checkWin(value);
      setResult(won ? 'win' : 'no');
      onResult?.(
        won ? 'success' : 'info',
        won
          ? '🎉 BINGO! That card is a winner.'
          : 'Not a winning card (or the token was not found).'
      );
    } catch (err) {
      onResult?.('error', err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <form className="panel token-checker" onSubmit={handleSubmit}>
      <label htmlFor="token" className="setup__label">
        Check a card by token
      </label>
      <div className="setup__row">
        <input
          id="token"
          className="input"
          type="text"
          placeholder="Paste playcard_token, e.g. vxhwG7TPiAMqwxd2"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setResult(null);
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="btn btn--success"
          disabled={!token.trim() || checking}
        >
          {checking ? 'Checking…' : 'Check Win'}
        </button>
      </div>

      {result && (
        <p className={`token-checker__result token-checker__result--${result}`} role="status">
          {result === 'win' ? '🎉 WINNER — BINGO!' : '✗ Not a win (or token not found)'}
        </p>
      )}
    </form>
  );
}