import test from 'node:test';
import assert from 'node:assert/strict';
import { isOwnedBy, isSuccess, normalizePosts, normalizeUser, parseBody } from './parsers.js';

test('parseBody handles JSON, plain booleans and PHP warnings before JSON', () => {
  assert.deepEqual(parseBody('{"success":true}'), { success: true });
  assert.equal(parseBody('false'), false);
  assert.equal(parseBody('true'), true);
  assert.equal(parseBody(''), null);
  assert.deepEqual(parseBody('<br />Warning: x in y\n[{"id":1}]'), [{ id: 1 }]);
  assert.equal(parseBody('Something odd'), 'Something odd');
});

test('isSuccess accepts every documented success form', () => {
  for (const v of [true, 'true', 'TRUE', 1, '1', { success: true }, { success: 'true' }]) assert.equal(isSuccess(v), true, String(v));
  for (const v of [false, 'false', 0, null, undefined, '', { success: false }, { success: 'false' }, {}, []]) assert.equal(isSuccess(v), false, JSON.stringify(v));
});

test('normalizeUser returns null for false and reads common id fields', () => {
  assert.equal(normalizeUser(false), null);
  assert.equal(normalizeUser('false'), null);
  assert.deepEqual(normalizeUser({ id: '7', username: 'Ana' }), { id: '7', username: 'Ana' });
  assert.deepEqual(normalizeUser({ user_id: 3 }, 'Ben'), { id: 3, username: 'Ben' });
  assert.deepEqual(normalizeUser([{ uid: 9, user: 'Cara' }]), { id: 9, username: 'Cara' });
  assert.equal(normalizeUser({ success: false }), null);
});

test('normalizePosts adapts different post and reply shapes', () => {
  const a = normalizePosts([{ id: 1, user_id: 5, user: 'Ana', post: 'Hello', date: '2026-01-01 10:00:00', reply: [{ id: 9, user: 'Ben', reply: 'Hi' }] }]);
  assert.equal(a[0].text, 'Hello');
  assert.equal(a[0].author, 'Ana');
  assert.equal(a[0].replies[0].text, 'Hi');
  assert.equal(a[0].replies[0].author, 'Ben');

  const b = normalizePosts({ posts: [{ post_id: 2, username: 'Cara', content: 'Yo', replies: [{ reply_id: 4, content: 'Hey' }] }] });
  assert.equal(b[0].id, 2);
  assert.equal(b[0].replies[0].id, 4);
  assert.equal(b[0].replies[0].text, 'Hey');

  assert.deepEqual(normalizePosts(false), []);
  assert.deepEqual(normalizePosts(null), []);
  assert.deepEqual(normalizePosts('no posts'), []);
  assert.equal(normalizePosts([{ id: 3, post: 'x', reply: null }])[0].replies.length, 0);
});

test('isOwnedBy compares ids first, then names, otherwise allows', () => {
  const user = { id: '5', username: 'Ana' };
  assert.equal(isOwnedBy(user, { authorId: 5, author: 'Zed' }), true);
  assert.equal(isOwnedBy(user, { authorId: 6, author: 'Ana' }), false);
  assert.equal(isOwnedBy(user, { authorId: null, author: 'ana' }), true);
  assert.equal(isOwnedBy(user, { authorId: null, author: 'Ben' }), false);
  assert.equal(isOwnedBy(user, { authorId: null, author: '' }), true);
  assert.equal(isOwnedBy(null, { authorId: 5 }), false);
});
