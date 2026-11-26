export const FILTERS = ['all', 'open', 'done'];

export const initialIssueState = {
  issues: [],
  filter: 'all',
  nextId: 1,
};

// Pure and immutable: never mutates `state` or any issue object, no side effects.
export function issueReducer(state, action) {
  switch (action.type) {
    case 'ADD_ISSUE': {
      const title = (action.payload?.title ?? '').trim();
      if (!title) return state;
      return {
        ...state,
        issues: [...state.issues, { id: state.nextId, title, done: false }],
        nextId: state.nextId + 1,
      };
    }
    case 'TOGGLE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.id === action.payload.id ? { ...issue, done: !issue.done } : issue
        ),
      };
    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.id !== action.payload.id),
      };
    case 'SET_FILTER':
      if (!FILTERS.includes(action.payload.filter)) return state;
      return { ...state, filter: action.payload.filter };
    case 'CLEAR_DONE':
      return { ...state, issues: state.issues.filter((issue) => !issue.done) };
    default:
      return state; // unknown actions preserve the existing state
  }
}
