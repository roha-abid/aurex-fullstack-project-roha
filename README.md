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

- Register, log in and log out
- Passwords hashed with bcrypt; JWT-protected API routes
- Add, view, edit, delete and complete tasks
- Filter tasks by status
- Each user sees only their own tasks (data isolation)
- Loading, error and validation states; responsive UI

## Architecture

```
React frontend  --HTTP + JWT-->  Express API  --Mongoose-->  MongoDB Atlas
                                  |- /api/auth  (register, login, me)
                                  |- /api/tasks (protected CRUD)
```

## Project structure

```
aurex-fullstack-project-roha/
├── frontend/     React app (Vite)
├── backend/      Express API (see backend/README.md for full API docs)
├── docs/         Postman collection + screenshots
├── README.md
└── .gitignore
```

## Run locally

**Prerequisites:** Node.js (LTS), a MongoDB Atlas cluster.

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env  -> then fill in values
npm run dev              # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

### Environment variables

Backend (`backend/.env`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
Frontend (`frontend/.env`): `VITE_API_URL`

Real `.env` files are never committed; use the `.env.example` files as templates.

## Documentation

- API endpoints, database schema and authentication explanation: [`backend/README.md`](backend/README.md)
- Postman collection: [`docs/Tasks-Auth-API.postman_collection.json`](docs/)
- Screenshots: [`docs/screenshots/`](docs/screenshots/)

## Testing summary

Tested with Postman: successful and duplicate registration, correct and wrong login, requests with no / invalid token, full task CRUD, filtering, and data isolation between two users (User B receives 404 when accessing User A's task).

## Known limitations

- TODO: fill in honestly at the end (for example: no password reset, no refresh tokens)

## What I learned

- TODO: write 3-4 sentences in your own words at the end
