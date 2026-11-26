import CourseList from "./CourseList";

export default function CourseSection({ courses, adviserName, onCourseSelect }) {
  return (
    <section className="course-section">
      <h2 className="section-title">Enrolled Courses</h2>
      <CourseList
        courses={courses}
        adviserName={adviserName}
        onCourseSelect={onCourseSelect}
      />
    </section>
  );
}
