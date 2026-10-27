# Backend - Task Manager API

REST API built with **Node.js, Express 5, MongoDB (Mongoose)**. Users register and log in with **JWT authentication**; passwords are hashed with **bcrypt**; every task belongs to one user and is invisible to everyone else.

## Setup

```bash
cd backend
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
# open .env and fill in your values
npm run dev               # http://localhost:5000
```

### Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS, comma-separated |

`.env` is listed in `.gitignore` and is never committed.

## Folder structure

```
backend/
├── src/
│   ├── config/db.js                  MongoDB connection
│   ├── models/User.js, Task.js       Mongoose schemas
│   ├── controllers/                  Request logic (auth, tasks)
│   ├── middleware/
│   │   ├── authMiddleware.js         JWT verification (protect)
│   │   └── errorHandler.js           404 + central error handling
│   ├── routes/                       URL -> controller mapping
│   ├── app.js                        Express app (middleware + routes)
│   └── server.js                     Local development starter
├── api/index.js                      Vercel serverless entry point
├── vercel.json                       Routes every URL to that function
├── .env.example
└── package.json
```

## API endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Auth | Description | Success | Errors |
| --- | --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | Create account, returns token | 201 | 400, 409 |
| POST | `/auth/login` | No | Log in, returns token | 200 | 400, 401 |
| GET | `/auth/me` | Yes | Current user's profile | 200 | 401 |

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| POST | `/tasks` | Create a task | 201 | 400, 401 |
| GET | `/tasks` | List my tasks (optional `?status=pending`) | 200 | 401 |
| GET | `/tasks/:id` | Get one of my tasks | 200 | 400, 401, 404 |
| PUT | `/tasks/:id` | Edit a task / mark complete | 200 | 400, 401, 404 |
| DELETE | `/tasks/:id` | Delete a task | 200 | 400, 401, 404 |

### Examples

**Register** - `POST /api/auth/register`
```json
{ "name": "Ali", "email": "ali@test.com", "password": "123456" }
```
Response `201`:
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Ali", "email": "ali@test.com" } }
```

**Create task** - `POST /api/tasks` with header `Authorization: Bearer <jwt>`
```json
{ "title": "Learn JWT", "description": "Finish week 4", "priority": "high" }
```

**Mark complete** - `PUT /api/tasks/:id`
```json
{ "status": "completed" }
```

Errors always look like `{ "message": "..." }`.

## Database schema

**User**

| Field | Type | Notes |
| --- | --- | --- |
| name | String | required |
| email | String | required, unique, lowercase, validated |
| password | String | required, min 6, **bcrypt hash**, hidden from queries by default |
| createdAt / updatedAt | Date | automatic |

**Task**

| Field | Type | Notes |
| --- | --- | --- |
| title | String | required, min 3 characters |
| description | String | optional |
| status | String | `pending` (default), `in-progress`, `completed` |
| priority | String | `low`, `medium` (default), `high` |
| user | ObjectId -> User | required; the owner of the task |
| createdAt / updatedAt | Date | automatic |

## How authentication works

1. **Register:** the password is hashed with bcrypt (10 salt rounds) and only the hash is stored.
2. **Login:** bcrypt compares the submitted password with the stored hash. On success the server signs a JWT containing the user's id (expires per `JWT_EXPIRES_IN`).
3. **Protected requests:** the client sends `Authorization: Bearer <token>`. The `protect` middleware verifies the signature and expiry, loads the user, and attaches it to `req.user`. Missing, invalid or expired tokens get `401`.
4. **Same error for wrong email and wrong password** so attackers cannot discover which emails exist.

## Data isolation (User A cannot see User B's tasks)

- On create, the task's `user` is taken from the verified token (`req.user._id`), **never** from the request body.
- Every read, update and delete queries by **both** the task id and the owner: `{ _id, user: req.user._id }`.
- Asking for someone else's task returns `404`, the same as a task that does not exist.
- Only `title`, `description`, `status` and `priority` can be set by the client (whitelist).

## Security practices

- Passwords hashed with bcrypt; never stored or returned in plain text
- Secrets only in `.env` (git-ignored); `.env.example` has placeholders
- CORS restricted to the configured frontend origin(s)
- Input validation in controllers and Mongoose schemas
- Central error handler; no stack traces sent to clients

## Deployment (Vercel serverless)

Live API: https://aurex-fullstack-project-roha.vercel.app

- `api/index.js` connects to MongoDB (reusing the connection between requests) and passes each request to the Express app from `src/app.js`.
- `vercel.json` sends every URL to that function, so routes like `/api/auth/login` work unchanged.
- Project settings on Vercel: root directory `backend`, framework preset "Other".
- Environment variables are set in the Vercel dashboard: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (the frontend URL). `PORT` is not needed.
- MongoDB Atlas network access allows `0.0.0.0/0`, because serverless functions have no fixed IP address.
- Locally, `npm run dev` still starts the same app through `src/server.js`.

## Testing

Tested manually with Postman. See `../docs/screenshots/` and `../docs/Tasks-Auth-API.postman_collection.json`.
