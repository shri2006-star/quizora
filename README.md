# Quizora — Quiz Management & Performance Tracking

A production-grade, full-stack quiz platform built with HTML5, CSS3, Vanilla JavaScript, Node.js/Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green) ![Express](https://img.shields.io/badge/Express-v4-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

### User Module
- **Dashboard** — Personalized greeting, quiz stats, recent activity, performance chart
- **Quiz Categories** — Browse, search, and filter available quiz topics
- **Quiz Taking** — One question at a time, circular countdown timer, question navigator, mark for review
- **Quiz Results** — Score doughnut chart, detailed question review with explanations
- **Quiz History** — Past attempts with filters, sorting, and pagination
- **Leaderboard** — Global and category-specific rankings with top-3 podium
- **Profile Management** — Edit name/email, change password

### Admin Module
- **Admin Dashboard** — Platform statistics, recent activity overview
- **Category Management** — Full CRUD with search and pagination
- **Question Management** — Add/edit questions with 4 options, correct answer, explanations
- **User Management** — View registered users, search, paginate
- **Results Management** — View all quiz attempts, filter, export to CSV

### Security
- JWT-based authentication with role-based access control
- Server-side quiz grading (correct answers never exposed before submission)
- Password hashing with bcrypt (12 rounds)
- Input validation with express-validator
- Helmet security headers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Charts | Chart.js 4 |
| Security | Helmet, CORS |

## Project Structure

```
ONLINE QUIZ SYSTEM/
├── server.js                    # Express entry point
├── package.json
├── .env.example
├── .gitignore
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── middleware/
│   │   ├── auth.js              # JWT protect & adminOnly
│   │   └── errorHandler.js      # Centralized error handler
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── questionController.js
│   │   ├── quizController.js
│   │   └── resultController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── resultRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── statsRoutes.js
│   │   └── userRoutes.js
│   └── utils/
│       ├── seed.js              # Database seeder
│       └── createAdmin.js       # CLI admin creator
└── frontend/
    ├── index.html               # SPA shell
    ├── css/
    │   ├── variables.css        # Design tokens
    │   ├── base.css             # Reset & typography
    │   ├── components.css       # Reusable components
    │   ├── layout.css           # Sidebar, topbar, grid
    │   └── pages.css            # Page-specific styles
    └── js/
        ├── utils.js             # Utilities & helpers
        ├── api.js               # API client
        ├── auth.js              # Auth state manager
        ├── components.js        # UI component generators
        ├── router.js            # Hash-based SPA router
        └── pages/
            ├── landing.js
            ├── login.js
            ├── register.js
            ├── publicCategories.js
            ├── publicLeaderboard.js
            ├── dashboard.js
            ├── categories.js
            ├── quizInstructions.js
            ├── quizTaking.js
            ├── quizResults.js
            ├── quizHistory.js
            ├── leaderboard.js
            ├── profile.js
            ├── adminDashboard.js
            ├── adminCategories.js
            ├── adminQuestions.js
            ├── adminUsers.js
            └── adminResults.js
```

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6 or higher (local or MongoDB Atlas)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   cd "ONLINE QUIZ SYSTEM"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your settings:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/quizora
   JWT_SECRET=your-super-secret-key-change-this
   JWT_EXPIRES_IN=7d
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas by updating MONGODB_URI in .env
   ```

5. **Seed the database** (creates admin, sample users, 6 categories, 48+ questions)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:5000
   ```

## Default Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quizora.com | Admin@123 |
| User | john@example.com | User@123 |
| User | jane@example.com | User@123 |

> ⚠️ **Change these passwords immediately in production!**

## Creating Admin Accounts

Admin accounts should only be created via the CLI utility (not via public API):

```bash
npm run create-admin
```

Or with arguments:
```bash
node backend/utils/createAdmin.js --name "Admin Name" --email "admin@example.com" --password "SecurePass123"
```

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/profile | Auth | Get profile |
| PUT | /api/auth/profile | Auth | Update profile |
| PUT | /api/auth/change-password | Auth | Change password |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/categories | Public | List categories |
| GET | /api/categories/:id | Public | Get category |
| POST | /api/categories | Admin | Create category |
| PUT | /api/categories/:id | Admin | Update category |
| DELETE | /api/categories/:id | Admin | Delete category |

### Questions
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/questions | Admin | List questions |
| POST | /api/questions | Admin | Create question |
| PUT | /api/questions/:id | Admin | Update question |
| DELETE | /api/questions/:id | Admin | Delete question |

### Quiz
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/quiz/start | Auth | Start quiz (get questions without answers) |
| POST | /api/quiz/submit | Auth | Submit answers (server-side grading) |

### Results & Stats
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/results/my | Auth | User's results |
| GET | /api/results/:id | Auth | Result details |
| GET | /api/results | Admin | All results |
| GET | /api/leaderboard | Public | Leaderboard |
| GET | /api/stats/dashboard | Auth | User stats |
| GET | /api/stats/admin | Admin | Platform stats |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users | Admin | List users |
| GET | /api/users/:id | Admin | User details |

## Deployment Notes

1. Set `NODE_ENV=production` in your environment
2. Use a strong, unique `JWT_SECRET`
3. Use MongoDB Atlas for cloud database
4. Consider a reverse proxy (Nginx) for production
5. Enable HTTPS in production

## License

MIT
