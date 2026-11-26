// NAMED EXPORT — do not import this as a default.
export function ProgressStatus({ score, passingScore, adviserName }) {
  const isPassing = score >= passingScore;
  const statusLabel = isPassing ? "Passing" : "At Risk";
  const statusClass = isPassing ? "status-badge status-passing" : "status-badge status-at-risk";

  return (
    <div className="progress-status">
      <span className={statusClass}>{statusLabel}</span>
      <p className="adviser-note">Adviser: {adviserName}</p>
    </div>
  );
}
