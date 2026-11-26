import useAnimatedNumber from "../hooks/useAnimatedNumber.js";
import { BAR_MAX, totalDuration } from "../utils/queueUtils.js";

export default function QueueDuration({ tasks }) {
  const total = totalDuration(tasks); // derived from the queue
  const shown = useAnimatedNumber(Math.ceil(total));
  const pct = Math.min(100, (total / BAR_MAX) * 100);
  const level = pct < 40 ? "low" : pct < 75 ? "mid" : "high";

  return (
    <div>
      <div className="bar-track">
        <div className={`bar-fill ${level}`} style={{ width: `${pct}%` }} />
      </div>
      <small>{shown}s</small>
    </div>
  );
}
