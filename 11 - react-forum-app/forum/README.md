# React Forum App

A Vite + React 18 forum client for the `hyeumine.com` forum endpoints. Native React hooks only (no state library, no router, no UI kit).

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for the response parsers (Node's built-in runner)
npm run build    # production build
```

## Features

- Register (`forumCreateUser.php`) and log in (`forumLogin.php`). The session (user id and display name, never the password) lives in React state and `sessionStorage`. The header shows "Signed in as ..." and a Log out button.
- Paginated feed (`forumGetPosts.php?page=N`) with Previous / Next, loading, empty and error (with Try again) states.
- Create posts (`forumNewPost.php`), delete posts (`forumDeletePost.php`) with a confirm step.
- Replies under each post (`forumReplyPost.php`, `forumDeleteReply.php`), shown as an indented thread.
- Success, info and error banners; buttons and fields are disabled while a request is running.

## Project structure

```
src/
  config.js                  API base URL, first page number, timeout
  services/
    forumApi.js              every network call (one place), timeouts, error handling
    parsers.js               pure helpers: parse body, success check, normalize users/posts/replies
    parsers.test.js          unit tests for the parsers
  context/
    AuthContext.jsx          user session (sign in, sign up, sign out)
    NoticeContext.jsx        success / info / error banner
  hooks/usePosts.js          loads one page, cancels stale requests, quiet refresh
  components/                Forum, Header, AuthModal, PostComposer, PostCard, ReplyForm,
                             ConfirmButton, Pagination, Banner
vite.config.js               dev/preview proxy: /api -> http://hyeumine.com
```

## How requests are sent

| Endpoint | Method | Sent as |
|----------|--------|---------|
| `forumGetPosts.php` | GET | `?page=` |
| `forumCreateUser.php`, `forumLogin.php` | POST | form fields `username`, `password` |
| `forumNewPost.php` | POST | form fields `id`, `post` |
| `forumReplyPost.php` | POST | form fields `user_id`, `post_id`, `reply` |
| `forumDeletePost.php`, `forumDeleteReply.php` | GET | `?id=` |

POST bodies use `application/x-www-form-urlencoded`, which is what PHP reads through `$_POST`.

## API notes and assumptions (please read)

I could not reach `hyeumine.com` while building this, so the real response shapes were not seen. The app was tested against a local mock server written from `Forum.pdf`, plus unit tests for different response shapes. Run it against the real server and adjust `src/services/parsers.js` if a field name differs.

- **Plain http.** When fetched over https, the host answered `302` back to `http://hyeumine.com/...` (and dropped the query string). The site is http-only. That is why the app calls `/api/...` and `vite.config.js` proxies it to `http://hyeumine.com`: no mixed-content or CORS errors. Do not deploy the app to an https host without a proxy that does the same. To call the server directly, create `.env.local` with `VITE_API_BASE=http://hyeumine.com` (needs CORS headers and an http page).
- **Page numbers** are assumed to start at 1. If the server starts at 0, change `FIRST_PAGE` in `src/config.js`.
- **End of feed.** The API does not return a page count, so Next stays enabled until a page comes back empty; the app then steps back to the last full page and disables Next.
- **Response shapes are normalized.** Posts and replies are read from several likely field names (`id`/`post_id`, `user`/`username`, `post`/`content`, `reply`/`replies`, `date`/`created_at`). The reply list may be an array under `reply` or `replies`. An empty page may be `[]`, `false` or an empty body.
- **`success = true`** is accepted as `true`, `"true"`, `1`, `{"success":true}` or `{"success":"true"}`. `false` or anything else is treated as a failure and shown as an error banner.
- **Login returns `false`** for bad credentials; it is shown as "Invalid first name or last name." Per the spec the username is the first name and the password is the last name.
- **PHP warnings.** If the server prepends warnings or HTML to JSON, the parser extracts the JSON part.
- **Ownership.** Delete buttons appear only on your own posts and replies when the response includes the author's id or name. If it includes neither, the button is shown and the server decides.
- **Shared server.** The forum is public, so avoid deleting things that are not yours while testing.

## Known limitations

- The new post is expected on page 1 (newest first); if the server sorts oldest first, it will appear on the last page.
- Sessions last for the browser tab only (`sessionStorage`).
