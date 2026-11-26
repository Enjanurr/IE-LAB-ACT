import { dashboardUrl } from '../api.js';

export default function SessionSetup({ code, onCodeChange, onGetCard, loading }) {
  const trimmed = code.trim();
  const disabled = !trimmed;

  const openDashboard = () => {
    window.open(dashboardUrl(trimmed), '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && !loading) onGetCard();
  };

  return (
    <form className="panel setup" onSubmit={handleSubmit}>
      <label htmlFor="bcode" className="setup__label">
        Game Code
      </label>
      <div className="setup__row">
        <input
          id="bcode"
          className="input"
          type="text"
          placeholder="e.g. HEelhJos"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="btn btn--secondary"
          onClick={openDashboard}
          disabled={disabled}
        >
          Open Dashboard ↗
        </button>
        <button type="submit" className="btn btn--primary" disabled={disabled || loading}>
          {loading ? 'Getting card…' : '+ Get Card'}
        </button>
      </div>
    </form>
  );
}
