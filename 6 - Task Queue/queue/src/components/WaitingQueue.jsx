import TaskItem from "./TaskItem.jsx";

export default function WaitingQueue({ tasks }) {
  return (
    <div>
      <h3>Task Queue</h3>
      <div className="chips">
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
