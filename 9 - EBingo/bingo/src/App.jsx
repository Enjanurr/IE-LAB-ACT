import { useCallback, useEffect, useRef, useState } from 'react';
import { checkWin, fetchCard } from './api.js';
import SessionSetup from './components/SessionSetup.jsx';
import TokenChecker from './components/TokenChecker.jsx';
import BingoCard from './components/BingoCard.jsx';
import Toasts from './components/Toasts.jsx';

const STORAGE_KEY = 'bingo:v1';

// Persist code + cards so a refresh doesn't lose the player's tokens.
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { code: '', cards: [] };
    const parsed = JSON.parse(raw);
    return {
      code: parsed.code ?? '',
      cards: (parsed.cards ?? []).map((c) => ({
        token: c.token,
        rows: c.rows,
        daubed: new Set(c.daubed ?? []),
        checking: false,
        won: false,
      })),
    };
  } catch {
    return { code: '', cards: [] };
  }
}

export default function App() {
  const saved = useRef(loadSaved()).current;
  const [code, setCode] = useState(saved.code);
  const [cards, setCards] = useState(saved.cards);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          code,
          cards: cards.map(({ token, rows, daubed }) => ({
            token,
            rows,
            daubed: [...daubed],
          })),
        })
      );
    } catch {
      /* storage unavailable: ignore */
    }
  }, [code, cards]);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (type, message) => {
      const id = ++toastId.current;
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast]
  );

  const updateCard = (token, patch) =>
    setCards((list) =>
      list.map((c) => (c.token === token ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c))
    );

  const handleGetCard = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const { token, rows } = await fetchCard(trimmed);
      setCards((list) =>
        list.some((c) => c.token === token)
          ? list
          : [...list, { token, rows, daubed: new Set(), checking: false, won: false }]
      );
    } catch (err) {
      setError(err.message);
      pushToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (token, key) =>
    updateCard(token, (c) => {
      const next = new Set(c.daubed);
      next.has(key) ? next.delete(key) : next.add(key);
      return { daubed: next };
    });

  const handleCheckWin = async (token) => {
    const idx = cards.findIndex((c) => c.token === token);
    updateCard(token, { checking: true });
    try {
      const won = await checkWin(token);
      updateCard(token, { checking: false, won });
      pushToast(
        won ? 'success' : 'info',
        won ? `🎉 Card ${idx + 1} is a winner — BINGO!` : `Card ${idx + 1}: no win yet. Keep daubing!`
      );
    } catch (err) {
      updateCard(token, { checking: false });
      pushToast('error', err.message);
    }
  };

  const handleClear = (token) => updateCard(token, { daubed: new Set(), won: false });

  const handleRemove = (token) => setCards((list) => list.filter((c) => c.token !== token));

  const handleReset = () => {
    if (cards.length && !window.confirm('Remove all cards?')) return;
    setCards([]);
    setError('');
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <span className="app__logo">B</span>ingo
        </h1>
        <p className="app__sub">Track multiple cards, daub numbers, and verify wins live.</p>
      </header>

      <main className="app__main">
        <SessionSetup code={code} onCodeChange={setCode} onGetCard={handleGetCard} loading={loading} />

        <TokenChecker onResult={pushToast} />

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}

        {cards.length > 0 && (
          <div className="toolbar">
            <span>
              {cards.length} card{cards.length === 1 ? '' : 's'}
            </span>
            <button className="btn btn--ghost" onClick={handleReset}>
              Remove all
            </button>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="empty">
            <p>No cards yet.</p>
            <p className="empty__hint">Enter a game code and press “Get Card” to start playing.</p>
          </div>
        ) : (
          <section className="cards">
            {cards.map((card, i) => (
              <BingoCard
                key={card.token}
                index={i}
                card={card}
                onToggle={handleToggle}
                onCheckWin={handleCheckWin}
                onClear={handleClear}
                onRemove={handleRemove}
              />
            ))}
          </section>
        )}
      </main>

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}