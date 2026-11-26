import TaskItem from "./TaskItem.jsx";
import QueueDuration from "./QueueDuration.jsx";

export default function ServiceQueue({ title, tasks, type }) {
  return (
    <section className={`service ${type === "high" ? "service-high" : ""}`}>
      <h4>{title}</h4>
      <div className="label">Queue List:</div>
      <div className="chips">
        {tasks.map((t, i) => (
          <TaskItem key={t.id} task={t} serving={i === 0} />
        ))}
      </div>
      <div className="label">Duration:</div>
      <QueueDuration tasks={tasks} />
    </section>
  );
}
