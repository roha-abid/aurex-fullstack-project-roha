# AUREX Full-Stack Project - Authenticated Task Management System

Month 2, Week 4 deliverable of the AUREX Full-Stack Engineering Internship.
A full-stack task manager where users register, log in, and manage **their own private tasks**.

**Author:** Roha Abid

## Live demo

| Part | URL |
| --- | --- |
| Frontend (Vercel) | TODO: add after deployment |
| Backend API (Render) | TODO: add after deployment |

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- Register, log in and log out (animated sliding login/register page)
- Passwords hashed with bcrypt; JWT-protected API routes
- Add, view, edit, delete and complete tasks (pending / in progress / completed)
- Filter tasks by status
- Each user sees only their own tasks (data isolation)
- Loading, error, empty and validation states; responsive UI
- Expired or invalid tokens log the user out automatically

## Architecture

```
React frontend  --HTTP + JWT-->  Express API  --Mongoose-->  MongoDB Atlas
                                  |- /api/auth  (register, login, me)
                                  |- /api/tasks (protected CRUD)
```

## Project structure

```
aurex-fullstack-project-roha/
├── frontend/     React app (Vite)  - see frontend/README.md
├── backend/      Express API       - see backend/README.md (full API docs)
├── docs/         Postman collection + screenshots
├── README.md
└── .gitignore
```

## Run locally

**Prerequisites:** Node.js (LTS) and a MongoDB Atlas cluster. Use two terminals.

```bash
# Terminal 1 - backend
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env  -> then fill in values
npm run dev              # http://localhost:5000

# Terminal 2 - frontend
cd frontend
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

### Environment variables

| File | Variables |
| --- | --- |
| `backend/.env` | `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` |
| `frontend/.env` | `VITE_API_URL` |

Real `.env` files are never committed; use the `.env.example` files as templates.

## Deployment

| Part | Platform | Settings |
| --- | --- | --- |
| Database | MongoDB Atlas | Network access allows the hosting provider; connection string stored as `MONGODB_URI` |
| Backend | Render (Web Service) | Root directory `backend`, build `npm install`, start `npm start`; set the 5 backend variables |
| Frontend | Vercel | Root directory `frontend`, framework Vite; set `VITE_API_URL` to the Render URL |

`CLIENT_URL` on Render must equal the Vercel URL so CORS allows the frontend.

## Documentation

- API endpoints, database schema and authentication explanation: [`backend/README.md`](backend/README.md)
- Frontend structure and auth flow: [`frontend/README.md`](frontend/README.md)
- Postman collection: [`docs/Tasks-Auth-API.postman_collection.json`](docs/Tasks-Auth-API.postman_collection.json)

## Screenshots

### Application

| | |
| --- | --- |
| **Register validation** ![](docs/screenshots/19-ui-register-validation.png) | **Register success** ![](docs/screenshots/20-ui-register-success.png) |
| **Task dashboard** ![](docs/screenshots/21-ui-dashboard-tasks.png) | **Filter: completed** ![](docs/screenshots/22-ui-filter-completed.png) |
| **Edit a task** ![](docs/screenshots/23-ui-edit-task.png) | **Login error** ![](docs/screenshots/24-ui-login-error.png) |
| **Protected route redirect** ![](docs/screenshots/25-ui-protected-redirect.png) | **Data isolation between users** ![](docs/screenshots/26-ui-data-isolation.png) |
| **Mobile view** ![](docs/screenshots/27-ui-mobile.png) | |

### API testing (Postman)

<details>
<summary>Authentication, authorization, CRUD and data isolation (click to expand)</summary>

**Authentication**

![](docs/screenshots/01-register-201.png)
![](docs/screenshots/02-register-duplicate-409.png)
![](docs/screenshots/03-login-200.png)
![](docs/screenshots/04-login-wrong-password-401.png)

**Authorization**

![](docs/screenshots/05-no-token-401.png)
![](docs/screenshots/06-invalid-token-401.png)
![](docs/screenshots/07-me-valid-token-200.png)

**CRUD**

![](docs/screenshots/08-create-task-201.png)
![](docs/screenshots/09-get-tasks-200.png)
![](docs/screenshots/10-update-task-200.png)
![](docs/screenshots/11-complete-task-200.png)
![](docs/screenshots/12-filter-completed-200.png)
![](docs/screenshots/16-delete-task-200.png)

**Data isolation (User B cannot see or change User A's tasks)**

![](docs/screenshots/13-register-sara-201.png)
![](docs/screenshots/14-sara-sees-empty-200.png)
![](docs/screenshots/15-sara-cannot-access-404.png)

**Database (MongoDB Atlas)**

![](docs/screenshots/17-atlas-users-hashed-password.png)
![](docs/screenshots/18-atlas-tasks-with-user.png)

</details>

## Testing summary

Tested with Postman and in the browser: successful and duplicate registration, correct and wrong login, requests with no / invalid token, full task CRUD, filtering, and data isolation between two users (User B receives 404 when accessing User A's task).

## Challenges faced

- **Running commands in the wrong folder.** `npm run dev` failed with "could not read package.json" because I ran it from the project root. The server commands must run inside `backend` or `frontend`, and only `git` commands run from the root.
- **Keeping one user's tasks private.** The main risk was a logged-in user reading or changing someone else's task. I solved it by taking the owner from the verified JWT (never from the request body) and querying every task by both its id and `user: req.user._id`. I proved it with a second account, which gets a 404 for the first user's task.
- **Overlapping forms on the sliding login page.** After the panel slid, the old Log in form stayed visible under the Register form. The fix was to fade the inactive form out and disable pointer events on it.
- **Secrets and the JWT secret.** I generated `JWT_SECRET` with a one-line Node command (it failed when split over two lines), kept it in `.env`, and checked with `git status` that `.env` was never committed.
- **`npm audit` warnings.** The 3 high-severity warnings came only from `nodemon`, a development tool that is not deployed. `npm audit --omit=dev` reports 0 vulnerabilities, so I did not run `npm audit fix --force`, which would have downgraded it.

## Known limitations

- No password reset or email verification
- JWT is stored in `localStorage`, which is simple but exposed if the site ever has an XSS bug (httpOnly cookies are safer)
- No refresh tokens: the user logs in again when the token expires
- No rate limiting on login attempts
- No pagination for very long task lists
- Tested manually (Postman and browser); no automated test suite
- Free-tier hosting: the backend may take ~30-60 seconds to wake up after being idle

## What I learned

- I learned how authentication really works end to end: bcrypt hashes the password before it is stored, the server signs a JWT on login, and a middleware checks that token on every protected request before the controller runs.
- I learned that security belongs in the database queries, not just the screens: filtering every task query by the logged-in user's id is what makes data isolation work, and testing it with two accounts proved it.
- On the frontend I learned how React context, route guards and one shared `api.js` file keep login state in one place, and how to handle loading, error and empty states so the app never just breaks silently.
- I also learned why secrets live in `.env` files and environment variables instead of source code, and how to test an API with Postman using saved tokens and status-code checks.
