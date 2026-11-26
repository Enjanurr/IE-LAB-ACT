export default function StudentProfile({ student }) {
  const { id, name, program, yearLevel } = student;

  return (
    <div className="student-profile">
      <h2>{name}</h2>
      <p className="student-meta">
        {program} · Year {yearLevel} · ID: {id}
      </p>
    </div>
  );
}