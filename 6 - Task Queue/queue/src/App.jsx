import { useEffect, useRef, useState } from "react";
import TaskControls from "./components/TaskControls.jsx";
import WaitingQueue from "./components/WaitingQueue.jsx";
import ServiceQueue from "./components/ServiceQueue.jsx";
import {
  HIGH_PROBABILITY,
  REGULAR_QUEUE_COUNT,
  SPEED,
  TICK_MS,
  leastLoadedIndex,
  pickNextTask,
  randomDuration,
  serveQueue,
} from "./utils/queueUtils.js";

// App owns ALL shared state
export default function App() {
  const [waitingTasks, setWaitingTasks] = useState([]);
  const [highQueue, setHighQueue] = useState([]);
  const [regularQueues, setRegularQueues] = useState(() =>
    Array.from({ length: REGULAR_QUEUE_COUNT }, () => [])
  );
  const nextId = useRef(1); // stable ids; no re-render needed

  // The "cashiers": every tick, each queue serves its first task.
  useEffect(() => {
    const step = (TICK_MS / 1000) * SPEED;
    const timer = setInterval(() => {
      setHighQueue((q) => serveQueue(q, step));
      setRegularQueues((qs) => {
        const next = qs.map((q) => serveQueue(q, step));
        return next.every((q, i) => q === qs[i]) ? qs : next;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const addRandomTask = () => {
    // Build the task outside the setter so the id is consumed only once.
    const duration = randomDuration();
    const task = {
      id: nextId.current++,
      duration,             // total work, never changes
      remaining: duration,  // counts down while being served
      priority: Math.random() < HIGH_PROBABILITY ? "HIGH" : "REGULAR",
    };
    setWaitingTasks((prev) => [...prev, task]);
  };

  const admitTask = () => {
    const task = pickNextTask(waitingTasks);
    if (!task) return; // empty waiting queue: do nothing

    setWaitingTasks((prev) => prev.filter((t) => t.id !== task.id));

    if (task.priority === "HIGH") {
      setHighQueue((prev) => [...prev, task]); // append keeps FIFO
    } else {
      setRegularQueues((prev) => {
        const target = leastLoadedIndex(prev); // uses remaining work
        return prev.map((q, i) => (i === target ? [...q, task] : q));
      });
    }
  };

  return (
    <div className="layout">
      <div className="left">
        <TaskControls onAdd={addRandomTask} onAdmit={admitTask} />
        <WaitingQueue tasks={waitingTasks} />
      </div>
      <div className="right">
        <ServiceQueue title="High Priority Queue 1" tasks={highQueue} type="high" />
        {regularQueues.map((q, i) => (
          <ServiceQueue key={i} title={`Regular Queue ${i + 2}`} tasks={q} type="regular" />
        ))}
      </div>
    </div>
  );
}
