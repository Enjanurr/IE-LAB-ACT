import { useState } from 'react';
import SmartTaskCounter from './exam1/TaskQueue.jsx';
import LiveSearchTimer from './exam2/LiveSearchTimer.jsx';
import AccessibleFormToolkit from './exam3/AccessibleFormToolkit.jsx';
import ApplicationPreferences from './exam4/ApplicationPreferences.jsx';
import ProductExplorer from './exam5/ProductExplorer.jsx';
import IssueTracker from './exam6/IssueTracker.jsx';

const EXAMS = [
  { id: 1, label: '1 · Task Counter', hook: 'useState', Component: SmartTaskCounter },
  { id: 2, label: '2 · Search & Timer', hook: 'useEffect', Component: LiveSearchTimer },
  { id: 3, label: '3 · Form Toolkit', hook: 'useRef', Component: AccessibleFormToolkit },
  { id: 4, label: '4 · Preferences', hook: 'useContext', Component: ApplicationPreferences },
  { id: 5, label: '5 · Product Explorer', hook: 'useMemo / useCallback', Component: ProductExplorer },
  { id: 6, label: '6 · Issue Tracker', hook: 'useReducer', Component: IssueTracker },
];

export default function App() {
  const [activeId, setActiveId] = useState(1);
  const active = EXAMS.find((e) => e.id === activeId);
  const ActiveExam = active.Component;

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Hooks Midterm Practical</h1>
        <p>Six modules, native React Hooks only.</p>
      </header>

      <nav className="tabs" role="tablist" aria-label="Exam modules">
        {EXAMS.map((exam) => (
          <button
            key={exam.id}
            role="tab"
            id={`tab-${exam.id}`}
            aria-selected={exam.id === activeId}
            aria-controls="exam-panel"
            className={exam.id === activeId ? 'tab active' : 'tab'}
            onClick={() => setActiveId(exam.id)}
          >
            {exam.label}
          </button>
        ))}
      </nav>

      <main id="exam-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="panel">
        <p className="hook-tag">Primary hooks: {active.hook}</p>
        <ActiveExam />
      </main>
    </div>
  );
}
