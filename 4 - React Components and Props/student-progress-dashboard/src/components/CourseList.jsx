import ProgressCard from "./ProgressCard";

export default function CourseList({ courses, adviserName, onCourseSelect }) {
  return (
    <div className="course-list">
      {courses.map((course) => (
        <ProgressCard
          key={course.id}
          title={course.title}
          score={course.score}
          passingScore={course.passingScore}
          units={course.units}
          adviserName={adviserName}
          onSelect={onCourseSelect}
        >
          {course.score < course.passingScore && (
            <p className="adviser-feedback">
              Please schedule a consultation to discuss improvement steps.
            </p>
          )}
        </ProgressCard>
      ))}
    </div>
  );
}
