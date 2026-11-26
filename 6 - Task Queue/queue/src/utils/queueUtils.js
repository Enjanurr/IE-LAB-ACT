// Tunable settings (handy for the live challenges)
export const HIGH_PROBABILITY = 0.3;   // chance a new task is HIGH
export const REGULAR_QUEUE_COUNT = 3;  // Regular Queues 2, 3, 4
export const DURATION_MIN = 5;         // seconds a task needs at the counter
export const DURATION_MAX = 30;
export const BAR_MAX = 90;             // seconds of backlog that fill a bar
export const TICK_MS = 200;            // how often every counter advances
export const SPEED = 1;                // seconds of work done per real second

export const randomDuration = () =>
  DURATION_MIN + Math.floor(Math.random() * (DURATION_MAX - DURATION_MIN + 1));

// Derived value: total work still left in a queue (never stored)
export const totalDuration = (tasks) =>
  tasks.reduce((sum, t) => sum + t.remaining, 0);

// Strict FIFO admission: always the task at the front of the waiting line,
// regardless of its priority. Priority only decides WHERE an admitted task
// is routed (High Priority queue vs. least-loaded Regular queue) — it never
// changes the ORDER tasks leave the waiting line. Do not scan ahead to find
// a HIGH task; [0] is always the answer, or undefined if nothing is waiting.
export function pickNextTask(waiting) {
  return waiting[0];
}

// Strict "<" means a tie keeps the lower-numbered queue.
export function leastLoadedIndex(queues) {
  let best = 0;
  queues.forEach((q, i) => {
    if (totalDuration(q) < totalDuration(queues[best])) best = i;
  });
  return best;
}

// One tick at the counter: only the FIRST task is served (FIFO).
// Returns a new array; an empty queue is returned as-is (no re-render).
export function serveQueue(queue, step) {
  if (queue.length === 0) return queue;
  const [head, ...rest] = queue;
  const remaining = head.remaining - step;
  return remaining <= 0 ? rest : [{ ...head, remaining }, ...rest];
}