import { API_BASE, REQUEST_TIMEOUT_MS } from './../config.js';
import { isSuccess, normalizePosts, normalizeUser, parseBody } from './parsers.js';

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// One place for every network call. GET sends a query string; POST sends form-encoded
// fields (what PHP reads through $_POST).
async function request(path, { method = 'GET', params, form, signal } = {}) {
  const url = new URL(`${API_BASE}/${path}`, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined,
      body: form ? new URLSearchParams(Object.entries(form).map(([k, v]) => [k, String(v)])) : undefined,
    });
    if (!response.ok) throw new ApiError(`The server responded with ${response.status}.`, { status: response.status });
    return parseBody(await response.text());
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      if (timedOut) throw new ApiError('The server took too long to respond. Please try again.', { code: 'TIMEOUT' });
      throw error; // cancelled on purpose; callers ignore it
    }
    throw new ApiError('Could not reach the forum server. Check your connection and try again.', { code: 'NETWORK' });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

const requireSuccess = (data, message) => {
  if (!isSuccess(data)) throw new ApiError(message, { code: 'REJECTED' });
};

export async function getPosts(page, { signal } = {}) {
  return normalizePosts(await request('forumGetPosts.php', { params: { page }, signal }));
}

export async function login({ username, password }) {
  const data = await request('forumLogin.php', { method: 'POST', form: { username, password } });
  const user = normalizeUser(data, username);
  if (!user) throw new ApiError('Invalid first name or last name.', { code: 'INVALID_CREDENTIALS' });
  if (user.id === null) throw new ApiError('Login worked but the server did not return a user id.', { code: 'NO_ID' });
  return user;
}

export async function createUser({ username, password }) {
  const data = await request('forumCreateUser.php', { method: 'POST', form: { username, password } });
  const user = normalizeUser(data, username);
  if (!user) throw new ApiError('The account could not be created. The name may already be taken.', { code: 'REJECTED' });
  if (user.id === null) return login({ username, password }); // response had no id: sign in to get it
  return user;
}

export async function createPost({ userId, post }) {
  const data = await request('forumNewPost.php', { method: 'POST', form: { id: userId, post } });
  requireSuccess(data, 'The post could not be created.');
}

export async function deletePost(id) {
  const data = await request('forumDeletePost.php', { params: { id } });
  requireSuccess(data, 'The post could not be deleted.');
}

export async function replyToPost({ userId, postId, reply }) {
  const data = await request('forumReplyPost.php', { method: 'POST', form: { user_id: userId, post_id: postId, reply } });
  requireSuccess(data, 'The reply could not be added.');
}

export async function deleteReply(id) {
  const data = await request('forumDeleteReply.php', { params: { id } });
  requireSuccess(data, 'The reply could not be deleted.');
}
