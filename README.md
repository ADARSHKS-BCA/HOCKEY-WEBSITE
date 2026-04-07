# 🏒 HockeyHub

A modern, full-stack web application for managing hockey game registrations, team management, solo matchmaking, match scheduling, and automated email notifications — all wrapped in a premium glassmorphic UI with a cinematic video background.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens&logoColor=white)

---

## ✨ Features

### 🎯 Core
- **User Authentication** — Register/Login with JWT-secured sessions and bcrypt password hashing.
- **Team Management** — Create teams with unique 6-character invite codes, join existing teams, manage rosters.
- **Random Matchmaking** — Solo players queue up and are auto-drafted into balanced teams using a skill-based serpentine algorithm.
- **Match Scheduling** — Admins can manually create matches or auto-generate round-robin fixtures.
- **Email Notifications** — Styled HTML match reminders sent via Nodemailer to all players on both teams.
- **Leaderboard** — Global rankings for top teams and players by win count.

### 🎨 Design
- **Cinematic Video Background** — Full-screen looping hockey video merged seamlessly across every page.
- **Light / Dark Mode** — Toggle with ☀️/🌙 button, persisted in localStorage, powered by Tailwind's `darkMode: 'class'`.
- **Glassmorphism UI** — Frosted-glass cards with backdrop blur, smooth hover animations, and gradient accents.
- **Fully Responsive** — Works on desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 19, Vite 6, Tailwind CSS 3            |
| Routing    | React Router 7                               |
| HTTP       | Axios (with JWT interceptor)                 |
| Backend    | Node.js, Express 4                           |
| Database   | MongoDB with Mongoose 8                      |
| Auth       | JSON Web Tokens (jsonwebtoken) + bcryptjs     |
| Email      | Nodemailer (Gmail SMTP)                       |
| Fonts      | Google Fonts (Outfit, Inter)                  |

---

## 📂 Project Structure

```
HOCKEY-WEBSITE/
├── public/                          # Static assets & video
├── src/                             # React frontend
│   ├── api/axios.js                 # Axios instance with JWT interceptor
│   ├── components/                  # Reusable UI components
│   │   ├── Navbar.jsx               # Top nav with theme toggle
│   │   ├── Footer.jsx               # Site footer
│   │   ├── TeamCard.jsx             # Team roster display card
│   │   ├── MatchCard.jsx            # Match schedule/score card
│   │   ├── ProtectedRoute.jsx       # Auth-gated route wrapper
│   │   └── Toast.jsx                # Notification toast
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx          # Authentication state
│   │   └── ThemeContext.jsx         # Light/Dark mode state
│   ├── pages/                       # Route pages
│   │   ├── Home.jsx                 # Landing page with portal cards
│   │   ├── Login.jsx                # Login form
│   │   ├── Register.jsx             # Registration form
│   │   ├── Dashboard.jsx            # Player dashboard
│   │   ├── Teams.jsx                # Team browser / create / join
│   │   ├── Matchmaking.jsx          # Solo queue with live polling
│   │   ├── Leaderboard.jsx          # Hall of fame rankings
│   │   └── AdminPanel.jsx           # Admin controls & scoring
│   ├── App.jsx                      # Root component with routes & video background
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind directives & custom components
├── server/                          # Express backend
│   ├── config/db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   └── admin.js                 # Admin role check middleware
│   ├── models/
│   │   ├── User.js                  # User schema (bcrypt, skill levels)
│   │   ├── Team.js                  # Team schema (code generator)
│   │   └── Match.js                 # Match schema (scoring, status)
│   ├── routes/
│   │   ├── auth.js                  # Register, Login, Profile
│   │   ├── teams.js                 # CRUD + join by code
│   │   ├── matches.js               # List, create, auto-gen, score
│   │   ├── matchmaking.js           # Queue join/leave, admin trigger
│   │   ├── admin.js                 # Stats, player/team management
│   │   ├── notifications.js         # Email dispatch per match
│   │   └── leaderboard.js           # Public rankings
│   ├── services/
│   │   ├── matchmaker.js            # Serpentine draft algorithm
│   │   └── emailService.js          # Nodemailer HTML templates
│   ├── index.js                     # Server entry point
│   ├── seed.js                      # Admin user seeder
│   ├── .env                         # Environment variables (local)
│   └── .env.example                 # Template for environment vars
├── index.html                       # Vite entry HTML
├── vite.config.js                   # Vite config (proxy to backend)
├── tailwind.config.js               # Tailwind theme customization
├── postcss.config.js                # PostCSS config
└── package.json                     # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/ADARSHKS-BCA/HOCKEY-WEBSITE.git
cd HOCKEY-WEBSITE
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 3. Configure environment variables

Edit `server/.env` with your credentials:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hockeyhub
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Gmail SMTP (optional, for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=HockeyHub <noreply@hockeyhub.com>

ADMIN_EMAIL=admin@hockeyhub.com
ADMIN_PASSWORD=admin123
```

### 4. Seed the admin user

```bash
cd server
npm run seed
```

### 5. Start the application

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5500)
cd HOCKEY-WEBSITE
npm run dev
```

Open [http://localhost:5500](http://localhost:5500) in your browser.

---

## 🔑 Default Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@hockeyhub.com    | admin123  |

> Sign up through the app to create player accounts.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description         | Auth |
|--------|--------------------|---------------------|------|
| POST   | `/api/auth/register` | Register new user    | ❌   |
| POST   | `/api/auth/login`    | Login, returns JWT   | ❌   |
| GET    | `/api/auth/me`       | Get current user     | ✅   |
| PUT    | `/api/auth/profile`  | Update profile       | ✅   |

### Teams
| Method | Endpoint               | Description           | Auth |
|--------|------------------------|-----------------------|------|
| POST   | `/api/teams`           | Create team            | ✅   |
| GET    | `/api/teams`           | List all teams         | ✅   |
| GET    | `/api/teams/:id`       | Team details           | ✅   |
| POST   | `/api/teams/join`      | Join by invite code    | ✅   |
| DELETE | `/api/teams/:id/leave` | Leave team             | ✅   |

### Matches
| Method | Endpoint                | Description             | Auth  |
|--------|-------------------------|-------------------------|-------|
| GET    | `/api/matches`          | List matches             | ✅    |
| GET    | `/api/matches/:id`      | Match details            | ✅    |
| POST   | `/api/matches`          | Create match             | Admin |
| POST   | `/api/matches/auto`     | Auto-generate matches    | Admin |
| PUT    | `/api/matches/:id/score`| Update score & complete  | Admin |

### Matchmaking
| Method | Endpoint                 | Description        | Auth  |
|--------|--------------------------|--------------------|-------|
| POST   | `/api/matchmaking/queue` | Join solo queue     | ✅    |
| DELETE | `/api/matchmaking/queue` | Leave queue         | ✅    |
| GET    | `/api/matchmaking/status`| Queue status        | ✅    |
| POST   | `/api/matchmaking/run`   | Trigger draft       | Admin |

### Other
| Method | Endpoint               | Description         | Auth  |
|--------|------------------------|---------------------|-------|
| GET    | `/api/leaderboard`     | Top players & teams  | ❌    |
| POST   | `/api/notifications/match/:id` | Email both teams | Admin |
| GET    | `/api/admin/stats`     | Dashboard stats      | Admin |

---

## 🎮 How It Works

### Solo Matchmaking Flow
1. Player registers and joins the **solo queue** from the Matchmaking page.
2. Admin triggers **Run Matchmaking Draft** from the Admin Panel.
3. The serpentine draft algorithm sorts players by skill level and distributes them into balanced teams.
4. Teams are auto-named (e.g., "Thunder Wolves", "Frost Dragons") and matches are auto-scheduled.
5. Admin can send **email notifications** to all players with match details.

### Team Flow
1. A player **creates a team** and receives a unique 6-character invite code (e.g., `HK4X9R`).
2. Other players **join using the code**.
3. Admin pairs teams into matches manually or via auto-generation.

---

## 🖼️ Screenshots

| Light Mode | Dark Mode |
|:----------:|:---------:|
| Clean glassmorphic cards over video | Deep contrast with neon accents |

> Toggle between modes using the ☀️/🌙 button in the top navigation bar.

---

## 👨‍💻 Author

**Adarsh KS**  
GitHub: [@ADARSHKS-BCA](https://github.com/ADARSHKS-BCA)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
