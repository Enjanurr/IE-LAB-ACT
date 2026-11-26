import { ProgressStatus } from "./ProgressStatus";

// DEFAULT EXPORT — do not import with curly braces.
export default function ProgressCard({
  title,
  score,
  passingScore = 75,
  units,
  adviserName,
  onSelect,
  children,
}) {
  const handleClick = () => {
    if (onSelect) {
      onSelect({ title, score, passingScore, units });
    }
  };

  return (
    <div
      className="progress-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <h3 className="course-title">{title}</h3>
      <p className="course-meta">
        Units: {units} · Score: {score} / Passing: {passingScore}
      </p>

      <ProgressStatus
        score={score}
        passingScore={passingScore}
        adviserName={adviserName}
      />

      {children && <div className="adviser-note-block">{children}</div>}
    </div>
  );
}
