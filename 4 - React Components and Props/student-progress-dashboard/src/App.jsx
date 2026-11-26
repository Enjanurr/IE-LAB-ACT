import StudentDashboard from "./components/StudentDashboard";
import { student, courses, adviserName } from "./data";
import "./styles.css";

export default function App() {
  const onCourseSelect = (course) => {
    console.log(`Selected course: ${course.title} (Score: ${course.score})`);
    alert(`Course selected: ${course.title}\nScore: ${course.score}/${course.passingScore}`);
  };

  return (
    <div className="app-container">
      <StudentDashboard
        student={student}
        courses={courses}
        adviserName={adviserName}
        onCourseSelect={onCourseSelect}
      />
    </div>
  );
}
