# Dental Clinic Task Manager

A full-stack task/appointment manager for a dental clinic, built with **Node.js, Express, MongoDB (Mongoose), EJS, TailwindCSS, and Passport.js (Local Strategy)**.

Authenticated users can create, view, update, and delete clinic tasks (e.g. "Tooth Extraction — Ahmad") through both a server-rendered web UI and a JSON REST API.

---

## 1. Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose ODM
- **Views:** EJS + express-ejs-layouts
- **Styling:** TailwindCSS (compiled via the Tailwind CLI)
- **Auth:** Passport.js Local Strategy, bcrypt password hashing, MongoDB-backed sessions
- **Other:** connect-flash (flash messages), method-override (PUT/DELETE from HTML forms)

---

## 2. Project Structure

```
project/
  package.json
  app.js
  .env.example
  config/
    db.js
    passport.js
  models/
    User.js
    Task.js
  routes/
    auth.js
    tasks.js
    api.js
  controllers/
    taskController.js
    authController.js
  middleware/
    isAuthenticated.js
    isAuthenticatedApi.js
    errorHandler.js
  views/
    layouts/layout.ejs
    auth/login.ejs
    auth/register.ejs
    tasks/index.ejs
    tasks/create.ejs
    tasks/edit.ejs
    404.ejs
  public/css/
    input.css      (Tailwind source)
    tailwind.css    (generated — do not edit directly)
  tailwind.config.js
  postcss.config.js
```

---

## 3. REST API Reference

All endpoints below require an active login session (cookie-based).

| Method | Endpoint          | Description       |
|--------|-------------------|--------------------|
| GET    | `/api/tasks`      | Get all tasks      |
| GET    | `/api/tasks/:id`  | Get one task       |
| POST   | `/api/tasks`      | Create a task      |
| PUT    | `/api/tasks/:id`  | Update a task      |
| DELETE | `/api/tasks/:id`  | Delete a task      |

Responses use a consistent JSON envelope: `{ "success": true/false, "data": ..., "message": ... }`.

## 3a. Additional Features

- **Photo / X-ray upload** — the create and edit task forms accept an optional image (JPG/PNG, up to 3MB). It's stored as a base64 data URI directly on the Task document, so it works out of the box on free hosting tiers with no separate file storage or cloud bucket needed. A thumbnail shows in the task list; the edit form lets you replace or remove it.
- **Popup actions menu** — each row in the task list has a ⋮ button that opens a small menu with Edit, Print Report, and Delete, instead of plain inline links.
- **Printable report** — the "Print Report" button opens a clean, standalone report page (`/tasks/report/print`) listing every task with its photo, patient, doctor, date, status, and notes. Use the on-page "Print / Save as PDF" button — this uses the browser's native print dialog, so no extra PDF library is required.


---

## 4. Run It Locally

### Step 1 — Install prerequisites
- [Node.js 18+](https://nodejs.org)
- A MongoDB database — either:
  - **Local MongoDB** (install MongoDB Community Server and run it on `mongodb://localhost:27017`), or
  - **MongoDB Atlas (free tier)** — recommended, see Section 6 below.

### Step 2 — Get the code
Unzip the project, then in a terminal:
```bash
cd project
npm install
```
`npm install` automatically compiles `tailwind.css` for you (via the `postinstall` script). You do not need to run the Tailwind build manually, though `npm run build:css` is available if you edit styles later.

### Step 3 — Configure environment variables
Copy the example file and fill in your own values:
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=3000
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=a-long-random-string
NODE_ENV=development
```
Generate a strong `SESSION_SECRET` quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4 — Start the server
```bash
npm start          # production mode
npm run dev         # development mode with auto-restart (nodemon)
```
Visit **http://localhost:3000** — you'll be redirected to the task list, then to login if you're not authenticated. Click **Register** to create your first account.

---

## 5. Push the Project to GitHub

From inside the `project` folder:

```bash
git init
git add .
git commit -m "Initial commit: Dental Clinic Task Manager"
```

Create a new empty repository on GitHub (no README/gitignore — you already have one), then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Your `.env` file is already excluded via `.gitignore`, so your database credentials and session secret will **not** be uploaded. `node_modules/` is excluded too — anyone cloning the repo just runs `npm install`.

---

## 6. Set Up a Free MongoDB Database (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new **free (M0) cluster**.
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so your hosting platform can connect.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add your database name before the `?`, e.g. `.../dental_clinic?retryWrites=true...`, and use this as your `MONGO_URI`.

---

## 7. Deploy to a Free Server (Render)

[Render](https://render.com) offers a free tier well-suited for this stack.

1. Push your project to GitHub (Section 5).
2. Go to [render.com](https://render.com) and sign up / log in (you can use your GitHub account).
3. Click **New → Web Service**, then select your repository.
4. Configure the service:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string |
   | `SESSION_SECRET` | a long random string |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` (Render sets `PORT` automatically, but it's safe to include) |
6. Click **Create Web Service**. Render will install dependencies (which also builds your Tailwind CSS via `postinstall`) and start the app.
7. Once deployed, Render gives you a live URL like `https://dental-clinic-task-manager.onrender.com`.

**Note:** Render's free tier spins down after periods of inactivity, so the first request after idle time may take ~30–60 seconds to respond while it wakes up. This is expected free-tier behavior, not a bug.

### Alternative free hosts
- **Railway** (railway.app) — similar workflow: connect GitHub repo, set the same environment variables, deploy.
- **Cyclic** or **Fly.io** — also support Node + MongoDB Atlas on free tiers, with slightly different setup flows.

---

## 8. Using the App

1. **Register** a new account (username + password, min. 6 characters).
2. **Log in** — you'll land on the task list.
3. **Create a task** — fill in title, patient name, doctor name, date/time, status, and optional notes.
4. **Edit or delete** any task from the list view.
5. **Log out** when finished — this ends your session.

All task routes (web and API) are protected: unauthenticated visitors are redirected to `/auth/login` (web) or receive a `401 Unauthorized` JSON response (API).

---

## 9. Troubleshooting

- **"MongoDB connection error" on startup** — double-check `MONGO_URI` in `.env`, and that your IP (or `0.0.0.0/0`) is allowed in Atlas Network Access.
- **Tailwind styles missing** — run `npm run build:css` manually to regenerate `public/css/tailwind.css`.
- **Sessions not persisting** — confirm `MONGO_URI` is reachable; sessions are stored in MongoDB via `connect-mongo`.
