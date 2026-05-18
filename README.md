# ContestHub — Pro Contest Platform

A full-stack contest management platform where users can discover, register, and compete in contests across various categories.

## Live Site

[Live Demo](https://procontestplatform.netlify.app)

## Features

1. **Role-Based Access Control** — Three roles: Admin, Creator, and Participant, each with a dedicated dashboard and permissions
2. **Firebase Authentication** — Email/password and Google OAuth login with JWT-secured API access
3. **Contest Discovery** — Browse all contests with search, category filter, and pagination
4. **Stripe Payment Integration** — Secure entry fee payment via Stripe Checkout (test mode)
5. **Submit Task Form** — After payment, participants can submit their entry link and notes from the contest details page
6. **Creator Dashboard** — Create, edit, and delete contests; view submissions; declare winners per contest
7. **Admin Dashboard** — Manage all users (change roles, delete) and manage all contests (approve/reject)
8. **Winner Declaration** — Creator selects a winner from paid submissions; winner's win count increments automatically
9. **Leaderboard** — Top winners ranked by total wins with profile photos and stats
10. **Countdown Timer** — Live countdown on contest details page showing days, hours, minutes, and seconds until deadline
11. **Dark / Light Theme** — System-wide theme toggle persisted in localStorage
12. **User Dashboard** — View participated contests (sorted by upcoming deadline), won contests, profile with win-percentage chart
13. **Responsive Design** — Mobile-first UI built with DaisyUI v5 + Tailwind CSS v4

## Tech Stack

**Frontend:** React 19, Vite, TanStack Query, React Hook Form, React Router v7, DaisyUI v5, Tailwind CSS v4, React DatePicker, Framer Motion, SweetAlert2, Firebase

**Backend:** Node.js, Express 5, MongoDB, Mongoose 9, JWT, Stripe, bcryptjs

## Credentials (Test Accounts)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | Admin@123 |
| Creator | creator@test.com | Creator@123 |
| User | test@test.com | Test@123 |

## Setup

```bash
# Client
cd pro-contest-platform-client
npm install
npm run dev

# Server
cd pro-contest-platform-server
npm install
npm run dev
```

Environment variables are required — see `.env` in each directory.
