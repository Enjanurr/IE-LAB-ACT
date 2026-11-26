export const LETTERS = ['B', 'I', 'N', 'G', 'O'];

const API_BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');
const DASHBOARD_URL = 'http://www.hyeumine.com/bingodashboard.php';

export function dashboardUrl(code) {
  return `${DASHBOARD_URL}?bcode=${encodeURIComponent(code)}`;
}

async function request(path, params, { signal } = {}) {
  const qs = new URLSearchParams(params).toString();
  let res;
  try {
    res = await fetch(`${API_BASE}/${path}?${qs}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Network error. Check your connection and try again.');
  }
  if (!res.ok) throw new Error(`Server responded with ${res.status}.`);
  return res.text();
}

/**
 * Fetch a new card. Normalises the response to:
 *   { token: string, rows: number[5][5] }   // rows[r][c], column c = B,I,N,G,O
 */
export async function fetchCard(code, opts) {
  const text = await request('getcard.php', { bcode: code }, opts);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid game code or unexpected server response.');
  }

  const token = data?.playcard_token;
  const card = data?.card;
  if (!token || !card) throw new Error('Invalid game code or malformed card data.');

  const columns = LETTERS.map((l) => card[l]);
  if (columns.some((c) => !Array.isArray(c) || c.length !== 5)) {
    throw new Error('Card data is malformed.');
  }

  const rows = Array.from({ length: 5 }, (_, r) =>
    columns.map((col) => Number(col[r]))
  );
  return { token: String(token), rows };
}

/** Returns true if the card is a winner. */
export async function checkWin(token, opts) {
  const text = await request('checkwin.php', { playcard_token: token }, opts);
  return text.trim() === '1';
}
