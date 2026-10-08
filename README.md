# 🎓 Student API (Week 3 CRUD Project)

A simple RESTful API built with Node.js and Express for managing students.

---

## 🚀 Live Demo

👉 https://week3-crud-todo-api-nge7.onrender.com/students
    https://week3-crud-todo-api-nge7.onrender.com/

---

## 📌 Features

- Create a student
- Get all students
- Get a single student
- Update a student
- Delete a student

---

## 🛠️ Tech Stack

- Node.js
- Express.js

---

## 📂 Project Structure

---

## 🔐 Auth API (used by the React frontend)

Base path: `/api/auth`. All bodies are JSON; errors look like `{ "error": "message", "code"?: "..." }`.

| Method | Path | What it does |
|---|---|---|
| POST | `/register` | Create account (unverified) and email a 6-digit code |
| POST | `/verify-otp` | `{ email, otp }` - verifies the account (max 5 wrong tries, 5 min expiry) |
| POST | `/resend-otp` | `{ email }` - new code (60 s cooldown) |
| POST | `/login` | `{ email, password }` - returns `{ token, user }` (token valid 7 days) |
| GET | `/me` | Needs `Authorization: Bearer <token>`; returns the current user |

`register` body: `firstName, lastName, email, phone, country, state, password (8+ chars)`, optional `otherNames, dob`, and `role` (`student` default, `alumni`, `parent`, `visitor`).

`/students` (create / list / delete) still exists but now requires a login token.

### Run locally
```
npm install
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm run dev
```
With no email provider configured and `NODE_ENV` not `production`, OTP codes are printed in the server log.

### Tests
```
MONGO_URI=mongodb://127.0.0.1:27017/fvic_test npm test
```
(Use a throw-away database: the tests delete all users.)

### Deploying on Render
Set `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS`, `BREVO_API_KEY`, `EMAIL_FROM`. Render's free tier blocks SMTP (Gmail) - that is why Brevo's HTTPS API is used.
