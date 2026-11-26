import { useState } from 'react';
import { LETTERS } from '../api.js';

const CHECKWIN_URL = 'http://www.hyeumine.com/checkwin.php';

export default function BingoCard({
  index,
  card,
  onToggle,
  onCheckWin,
  onClear,
  onRemove,
}) {
  const { token, rows, daubed, checking, won } = card;
  const marked = daubed.size;
  const [copied, setCopied] = useState(false);

  const testUrl = `${CHECKWIN_URL}?playcard_token=${encodeURIComponent(token)}`;

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = token;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className={`card ${won ? 'card--won' : ''}`} aria-label={`Bingo card ${index + 1}`}>
      <header className="card__header">
        <h2 className="card__title">
          Card {index + 1}
          {won && <span className="badge">BINGO!</span>}
        </h2>
        <button
          className="icon-btn"
          onClick={() => onRemove(token)}
          aria-label={`Remove card ${index + 1}`}
          title="Remove card"
        >
          ✕
        </button>
      </header>

      <div className="token">
        <span className="token__label">Token</span>
        <code className="token__value" title={token}>{token}</code>
        <button className="btn btn--ghost token__btn" onClick={copyToken}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <a
          className="btn btn--ghost token__btn"
          href={testUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Opens checkwin.php in a new tab (shows 1 or 0)"
        >
          Test link ↗
        </a>
      </div>

      <div className="grid" role="grid">
        <div className="grid__row grid__row--head" role="row">
          {LETTERS.map((l) => (
            <div key={l} className="grid__head" role="columnheader">
              {l}
            </div>
          ))}
        </div>

        {rows.map((row, r) => (
          <div className="grid__row" role="row" key={r}>
            {row.map((value, c) => {
              const key = `${r}-${c}`;
              const isFree = value === 0 || Number.isNaN(value);
              const isOn = isFree || daubed.has(key);
              return (
                <button
                  key={key}
                  role="gridcell"
                  className={`cell ${isOn ? 'cell--on' : ''} ${isFree ? 'cell--free' : ''}`}
                  aria-pressed={isOn}
                  disabled={isFree}
                  onClick={() => onToggle(token, key)}
                >
                  {isFree ? 'FREE' : String(value).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <footer className="card__footer">
        <span className="card__meta">{marked} marked</span>
        <div className="card__actions">
          <button className="btn btn--ghost" onClick={() => onClear(token)} disabled={marked === 0}>
            Clear
          </button>
          <button className="btn btn--success" onClick={() => onCheckWin(token)} disabled={checking}>
            {checking ? 'Checking…' : 'Check Win'}
          </button>
        </div>
      </footer>
    </article>
  );
}