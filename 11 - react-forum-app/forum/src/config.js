// Base URL for every request. "/api" is proxied to http://hyeumine.com by vite.config.js.
// To call the server directly instead, set VITE_API_BASE=http://hyeumine.com in .env.local
// (only works if the server sends CORS headers and the app is served over http).
export const API_BASE = (import.meta.env?.VITE_API_BASE ?? '/api').replace(/\/$/, '');

// The spec does not say whether pages start at 0 or 1. Change this if the server differs.
export const FIRST_PAGE = 1;

export const REQUEST_TIMEOUT_MS = 15000;
