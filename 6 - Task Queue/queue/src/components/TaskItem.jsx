export default function TaskItem({ task, serving = false }) {
  const cls = [
    "task",
    task.priority === "HIGH" ? "task-high" : "",
    serving ? "task-serving" : "",
  ].join(" ");
  const style = serving
    ? { "--pct": `${(task.remaining / task.duration) * 100}%` }
    : undefined;

  return (
    <span className={cls} style={style} title={`${task.priority} task, ${task.duration}s total`}>
      {Math.ceil(task.remaining)}
    </span>
  );
}
