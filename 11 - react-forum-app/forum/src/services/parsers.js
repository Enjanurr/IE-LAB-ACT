// Pure helpers that turn the server's loosely-typed responses into predictable shapes.
// No imports from config, so they can be unit tested with plain Node.

const pick = (obj, keys) => {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
};

const asText = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return asText(pick(value, ['username', 'name', 'first_name']));
  return String(value);
};

// The endpoints return JSON, the text "true"/"false", or JSON preceded by PHP warnings.
export function parseBody(text) {
  const trimmed = (text ?? '').trim();
  if (trimmed === '') return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.search(/[[{]/);
    const end = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        /* fall through to the raw text */
      }
    }
    return trimmed;
  }
}

// "success = true" may arrive as true, "true", 1, {"success":true} or {"success":"true"}.
export function isSuccess(value) {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') return ['true', '1', 'success'].includes(value.trim().toLowerCase());
  if (value && typeof value === 'object' && !Array.isArray(value) && 'success' in value) {
    return isSuccess(value.success);
  }
  return false;
}

export function normalizeUser(raw, fallbackName = '') {
  let data = Array.isArray(raw) ? raw[0] : raw;
  if (!data || typeof data !== 'object') return null; // false, "false", null, text
  if ('success' in data && !isSuccess(data.success)) return null;
  const inner = data.user && typeof data.user === 'object' ? data.user : data;
  const id = pick(inner, ['id', 'user_id', 'uid', 'userId', 'ID']);
  const username = asText(pick(inner, ['username', 'user', 'name', 'first_name', 'firstname'])) || fallbackName;
  return { id: id === undefined ? null : id, username };
}

export function normalizeReply(raw, index = 0) {
  const r = raw && typeof raw === 'object' ? raw : { reply: raw };
  const id = pick(r, ['id', 'reply_id', 'replyId', 'ID']);
  const authorId = pick(r, ['user_id', 'uid', 'userId', 'author_id', 'userid']);
  return {
    key: `r-${id ?? index}`,
    id: id ?? null,
    authorId: authorId ?? null,
    author: asText(pick(r, ['username', 'user', 'name', 'author', 'first_name'])),
    text: asText(pick(r, ['reply', 'content', 'body', 'text', 'message'])),
    date: asText(pick(r, ['date', 'created_at', 'createdAt', 'timestamp', 'datetime', 'time', 'posted_at'])),
  };
}

export function normalizePost(raw, index = 0) {
  const p = raw && typeof raw === 'object' ? raw : { post: raw };
  const id = pick(p, ['id', 'post_id', 'postId', 'ID']);
  const authorId = pick(p, ['user_id', 'uid', 'userId', 'author_id', 'userid']);
  let replies = pick(p, ['replies', 'reply', 'comments']);
  if (replies && !Array.isArray(replies)) replies = typeof replies === 'object' ? [replies] : [];
  return {
    key: `p-${id ?? index}`,
    id: id ?? null,
    authorId: authorId ?? null,
    author: asText(pick(p, ['username', 'user', 'name', 'author', 'first_name'])),
    text: asText(pick(p, ['post', 'content', 'body', 'text', 'message'])),
    date: asText(pick(p, ['date', 'created_at', 'createdAt', 'timestamp', 'datetime', 'time', 'posted_at'])),
    replies: (replies ?? []).map(normalizeReply),
  };
}

export function normalizePosts(raw) {
  let list = raw;
  if (list && !Array.isArray(list) && typeof list === 'object') {
    const inner = pick(list, ['posts', 'data', 'results', 'items']);
    list = Array.isArray(inner) ? inner : Object.values(list).every((v) => v && typeof v === 'object') ? Object.values(list) : [];
  }
  if (!Array.isArray(list)) return []; // false, "", null: treated as an empty page
  return list.map(normalizePost);
}

// Does this post/reply belong to the signed-in user? Unknown authorship returns true so the
// action stays available (the server decides).
export function isOwnedBy(user, item) {
  if (!user) return false;
  if (item.authorId !== null && item.authorId !== undefined && user.id !== null) {
    return String(item.authorId) === String(user.id);
  }
  if (item.author) return item.author.toLowerCase() === String(user.username).toLowerCase();
  return true;
}

export function formatDate(value) {
  if (!value) return '';
  const asNumber = Number(value);
  const date = new Date(Number.isFinite(asNumber) && asNumber > 1e9 ? (asNumber < 1e12 ? asNumber * 1000 : asNumber) : value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}
