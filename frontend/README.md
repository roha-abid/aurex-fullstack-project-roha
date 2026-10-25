# Frontend - Task Manager UI

React (Vite) single-page app that talks to the Express API in `../backend`.

## Setup

All commands are run inside the `frontend` folder (not the project root).

### 1. Install the packages

```bash
cd frontend
npm install
```

`npm install` reads `package.json` and downloads every package the app needs into a `node_modules/` folder (this folder is not committed to GitHub). It also creates `package-lock.json`, which pins the exact versions.

| Package | Type | Purpose |
| --- | --- | --- |
| `react`, `react-dom` | dependency | Build the user interface |
| `react-router-dom` | dependency | Page routing (`/login`, `/register`, `/`) and protected routes |
| `vite` | dev dependency | Development server and production build tool |
| `@vitejs/plugin-react` | dev dependency | Lets Vite compile React (JSX) code |

If you ever need to add the packages to a fresh project by hand, the equivalent commands are:

```bash
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react
```

### 2. Add the environment variable

```bash
copy .env.example .env      # Windows PowerShell (on Mac/Linux: cp .env.example .env)
```

Open `.env` and check that it contains the backend address:

```
VITE_API_URL=http://localhost:5000
```

The real `.env` file is git-ignored; only `.env.example` is committed.

### 3. Start the app

```bash
npm run dev               # http://localhost:5173
```

The backend must already be running (`npm run dev` inside the `backend` folder), otherwise the login and task requests cannot reach the API.

### Other commands

| Command | What it does |
| --- | --- |
| `npm run build` | Creates the production build in `dist/` |
| `npm run preview` | Serves the production build locally to test it |

The backend must be running too (default `http://localhost:5000`).

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API, no trailing slash (e.g. `https://your-api.onrender.com`) |

Build for production: `npm run build` (output in `dist/`).

## Structure

```
src/
├── main.jsx            App entry
├── App.jsx             Routes + route guards (Protected / GuestOnly)
├── AuthContext.jsx     Login state: user, authenticate(), logout()
├── api.js              fetch wrapper: adds the JWT, reads errors, handles 401
├── components/
│   ├── Header.jsx      App bar with user name and Log out
│   ├── AuthForm.jsx    Sliding Log in / Create account forms (+ AuthForm.css)
│   ├── TaskForm.jsx    Add a task (validated)
│   └── TaskItem.jsx    One task: change status, edit, delete
└── pages/
    ├── Login.jsx, Register.jsx
    └── Dashboard.jsx   Task list, filter, loading / error / empty states
```

## How authentication works in the UI

1. **Register / log in:** the form is validated, then sent to `/api/auth/...`. The returned JWT is saved in `localStorage`.
2. **Every request** goes through `api.js`, which adds `Authorization: Bearer <token>`.
3. **On page load**, `AuthContext` calls `/api/auth/me` to confirm the saved token is still valid.
4. **Protected routes:** `/` is only available when logged in; otherwise the user is redirected to `/login`. Logged-in users visiting `/login` or `/register` are sent to the dashboard.
5. **Unauthorized responses:** if the server answers 401 while a token is stored (expired or invalid), the app logs the user out automatically.
6. **Log out** removes the token and returns to the login page.

## UI states handled

Loading, error (with "Try again"), empty list, empty filter result, per-form validation messages, disabled buttons while saving, and a responsive layout down to phone width.

## Deployment (Vercel)

Root directory `frontend`, framework preset **Vite**, environment variable `VITE_API_URL` = your backend URL. `vercel.json` rewrites all paths to `index.html` so refreshing on `/login` works.
