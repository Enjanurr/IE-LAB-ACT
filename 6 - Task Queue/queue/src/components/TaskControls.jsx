export default function TaskControls({ onAdd, onAdmit }) {
  return (
    <div className="controls">
      <button onClick={onAdd}>ADD RANDOM TASK</button>
      <button onClick={onAdmit}>ADMIT TASK</button>
    </div>
  );
}
