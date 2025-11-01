# Backend for Latihan Frontend

This small Node + Express server provides authentication (JWT) and a simple CRUD API for `items` backed by PostgreSQL. It's intended to be used together with the frontend in the workspace.

Features

- POST /auth/register
- POST /auth/login (returns JWT)
- CRUD /items (protected by Bearer token)

Quick start

1. Copy `.env.example` to `.env` and fill your DB credentials and JWT secret.
2. From `server/` run:

```powershell
npm install
npm run dev
```

3. Run the migration SQL `server/migrations/init.sql` on your `tugas_fe_kedua` database. You can use psql or any DB tool.

Notes

- The `/items` endpoints require an Authorization header: `Authorization: Bearer <token>`.
- Passwords are hashed with bcrypt.
