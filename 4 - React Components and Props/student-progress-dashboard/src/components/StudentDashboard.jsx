import DashboardHeader from "./DashboardHeader";
import StudentProfile from "./StudentProfile";
import CourseSection from "./CourseSection";

export default function StudentDashboard({
  student,
  courses,
  adviserName,
  onCourseSelect,
}) {
  return (
    <main className="student-dashboard">
      <DashboardHeader />
      <StudentProfile student={student} />
      <CourseSection
        courses={courses}
        adviserName={adviserName}
        onCourseSelect={onCourseSelect}
      />
    </main>
  );
}