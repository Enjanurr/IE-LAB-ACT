import test from 'node:test';
import assert from 'node:assert/strict';
import { initialIssueState, issueReducer } from './issueReducer.js';

function deepFreeze(obj) {
  Object.values(obj).forEach((v) => typeof v === 'object' && v !== null && deepFreeze(v));
  return Object.freeze(obj);
}

test('ADD_ISSUE appends an open issue, increments nextId, and does not mutate', () => {
  const before = deepFreeze({ ...initialIssueState });
  const after = issueReducer(before, { type: 'ADD_ISSUE', payload: { title: 'Fix login' } });

  assert.deepEqual(after.issues, [{ id: 1, title: 'Fix login', done: false }]);
  assert.equal(after.nextId, 2);
  assert.equal(before.issues.length, 0);
});

test('TOGGLE_ISSUE flips only the matching issue and creates new objects', () => {
  const before = deepFreeze({
    issues: [
      { id: 1, title: 'A', done: false },
      { id: 2, title: 'B', done: false },
    ],
    filter: 'all',
    nextId: 3,
  });
  const after = issueReducer(before, { type: 'TOGGLE_ISSUE', payload: { id: 2 } });

  assert.equal(after.issues[0].done, false);
  assert.equal(after.issues[1].done, true);
  assert.notEqual(after.issues[1], before.issues[1]);
  assert.equal(after.issues[0], before.issues[0]);
});

test('CLEAR_DONE removes completed issues and keeps open ones', () => {
  const before = deepFreeze({
    issues: [
      { id: 1, title: 'A', done: true },
      { id: 2, title: 'B', done: false },
      { id: 3, title: 'C', done: true },
    ],
    filter: 'done',
    nextId: 4,
  });
  const after = issueReducer(before, { type: 'CLEAR_DONE' });

  assert.deepEqual(after.issues, [{ id: 2, title: 'B', done: false }]);
  assert.equal(after.filter, 'done');
  assert.equal(after.nextId, 4);
});

test('DELETE_ISSUE, SET_FILTER, and unknown actions behave correctly', () => {
  const state = deepFreeze({ issues: [{ id: 1, title: 'A', done: false }], filter: 'all', nextId: 2 });

  assert.deepEqual(issueReducer(state, { type: 'DELETE_ISSUE', payload: { id: 1 } }).issues, []);
  assert.equal(issueReducer(state, { type: 'SET_FILTER', payload: { filter: 'open' } }).filter, 'open');
  assert.equal(issueReducer(state, { type: 'SET_FILTER', payload: { filter: 'bogus' } }), state);
  assert.equal(issueReducer(state, { type: 'NOPE' }), state);
});
