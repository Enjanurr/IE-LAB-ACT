# Multi-Card Bingo

React + Vite app for playing several Bingo cards at once against the hyeumine.com Bingo API.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview    # http://localhost:4173 (includes the API proxy)
```

## Features

- Enter a **Game Code** and open the live dashboard in a new tab
- **Get Card** appends a new card each time (tokens are de-duplicated)
- Click any number to daub / un-daub it (center `0` is a FREE space)
- **Check Win** calls `checkwin.php` and shows a toast (`1` = win, `0` = not yet)
- Game code, cards and daubs persist in `localStorage` across refreshes

## Project layout

```
src/
  api.js                  API calls + response normalisation
  App.jsx                 State: code, cards, loading/error, toasts
  components/
    SessionSetup.jsx      Game code input + dashboard / get-card buttons
    BingoCard.jsx         5x5 B-I-N-G-O grid
    Toasts.jsx            Toast notifications
  styles.css              Modern CSS (light/dark aware)
vite.config.js            Dev/preview proxy: /api -> http://www.hyeumine.com
```

## Deployment note (important)

The API is **HTTP-only and sends no CORS headers**, so a browser on an HTTPS site cannot
call it directly (mixed content + CORS). The app calls `/api/*` and relies on a proxy:

- Dev/preview: handled by `vite.config.js`.
- Production: add a reverse-proxy rule that forwards `/api/*` to `http://www.hyeumine.com/*`.

Netlify (`public/_redirects` or `netlify.toml`):

```
/api/*  http://www.hyeumine.com/:splat  200
```

Vercel (`vercel.json`):

```json
{ "rewrites": [{ "source": "/api/:path*", "destination": "http://www.hyeumine.com/:path*" }] }
```

Nginx:

```
location /api/ { proxy_pass http://www.hyeumine.com/; }
```

Override the base URL with `VITE_API_BASE` (see `.env.example`).
