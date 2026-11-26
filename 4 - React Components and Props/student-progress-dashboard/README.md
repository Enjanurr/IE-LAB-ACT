# Student Progress Dashboard

A front-end React dashboard displaying enrolled courses and pass/fail statuses, built strictly with function components, prop drilling, and hardcoded data.

## Setup and Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in your terminal (default: `http://localhost:5173`).

Build and preview for production:

```bash
npm run build
npm run preview
```

## Component Responsibilities

| Component | Responsibility |
|---|---|
| `App.jsx` | Owns top-level state/data (`student`, `courses`, `adviserName`). Defines `onCourseSelect`. |
| `StudentDashboard.jsx` | Container layout rendering `DashboardHeader`, `StudentProfile`, and `CourseSection`. |
| `DashboardHeader.jsx` | Renders the primary dashboard title banner. |
| `StudentProfile.jsx` | Displays student identity information (`name`, `program`, `yearLevel`, `id`). |
| `CourseSection.jsx` | Wraps the course listing in a section; passes down `adviserName` and `onCourseSelect`. |
| `CourseList.jsx` | Maps over `courses` to render `ProgressCard` elements with conditional `children` feedback. |
| `ProgressCard.jsx` (default export) | Displays course details, handles click events, defaults `passingScore = 75`, and renders `ProgressStatus`. |
| `ProgressStatus.jsx` (named export) | Computes status (Passing / At Risk) and displays `adviserName`. |

## Props Owned vs. Forwarded

| Component | Props Owned (Used Locally) | Props Forwarded (Passed Down) |
|---|---|---|
| `App` | `student`, `courses`, `adviserName`, `onCourseSelect` | — |
| `StudentDashboard` | — | `student`, `adviserName`, `courses`, `onCourseSelect` |
| `DashboardHeader` | — | — |
| `StudentProfile` | `student` (`id`, `name`, `program`, `yearLevel`) | — |
| `CourseSection` | `courses` (passed to `CourseList`) | `adviserName`, `onCourseSelect` (passed to `CourseList`) |
| `CourseList` | `courses` (mapped to cards) | `adviserName`, `onCourseSelect` (passed to `ProgressCard`) |
| `ProgressCard` | `title`, `score`, `passingScore`, `units`, `onSelect`, `children` | `adviserName` (passed to `ProgressStatus`) |
| `ProgressStatus` | `score`, `passingScore`, `adviserName` | — |

## Prop Drilling Trace: adviserName

```text
App (owns adviserName = "Dr. Santos")
└─▶ StudentDashboard
    (receives, forwards — unused locally)
    └─▶ CourseSection
        (receives, forwards — unused locally)
        └─▶ CourseList
            (receives, forwards to each card — unused locally)
            └─▶ ProgressCard
                (receives, forwards to status — unused locally)
                └─▶ ProgressStatus
                    (receives AND renders adviserName ✅)
```

## Debugging Record

| Defect | Symptom | Correction | Technical Explanation |
|---|---|---|---|
| 1. Import/Export Mismatch | Syntax error loading `ProgressCard`. | Updated import to match default export. | Default exports do not use curly braces; named exports require destructured curly braces. |
| 2. Lowercase Tag Name | `<progressCard>` renders as an unknown HTML element. | Capitalized component tag to `<ProgressCard>`. | React treats lowercase tags as standard DOM elements and capitalized tags as React components. |
| 3. String Passed as Number | Incorrect comparison or string concatenation. | Passed `score` as an expression `{72}`. | Quoted prop values are treated as strings, which can cause problems with numerical operations. |
| 4. Direct Prop Mutation | Strict mode warning and potential side effects. | Removed `props.score = props.score + 5`. | React props are read-only and should not be mutated. |
| 5. Unclosed JSX Tag | Compilation syntax error. | Added self-closing slash `<ProgressStatus ... />`. | JSX elements without inner children must be self-closed. |
| 6. Omitted Prop Forwarding | `ProgressStatus` uses the default fallback threshold. | Explicitly forwarded `passingScore={props.passingScore}`. | Failing to forward the prop causes child components to lose custom configuration values. |

## AI Assistance and Verification

- **Prompts Used:** Consulted AI for deep prop-drilling tracing patterns and custom CSS styling guidance.
- **Rejected Suggestions:** Rejected an AI proposal to implement React Context (`useContext`), keeping prop drilling explicit per lab constraints.
- **Verification:** Verified data flow manually across all 5 component levels using React DevTools and browser console inspection.

## Individual Change Request

Extracted student identity details into an independent `StudentProfile.jsx` component and styled it manually using custom `.student-profile` CSS rules.

## Reflection

Building this Student Progress Dashboard helped me understand how React handles data without relying on shortcuts like Context or state managers.

- **Understanding Prop Drilling:** Passing `adviserName` through 5 component levels was repetitive, but it helped me see how data strictly moves from parent to child in React. It showed me why unidirectional data flow makes code easier to track, even if it requires extra code.
- **Using Component Composition:** Working with `props.children` to pass adviser notes into `ProgressCard` showed me how to make components reusable. I learned that composition can keep components flexible without needing extra props.
- **Debugging React Errors:** Fixing errors like mismatched default/named imports, lowercase tags, passing numbers as strings, and mutating props gave me a better understanding of how React reads JSX and handles props.
- **Coding Independently:** Refactoring the layout to extract `StudentProfile` into its own component and tweaking the CSS gave me the confidence to break down user interfaces and build React apps on my own.
