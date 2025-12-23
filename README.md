# TaskFlow

> A modern and minimalist Task Manager for freelancers who need to organize their work efficiently.

[![Status](https://img.shields.io/badge/status-MVP%20Complete-success)](https://taskflow-mp.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node-20+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Live Demo

**Try it now:** [https://taskflow-mp.vercel.app/](https://taskflow-mp.vercel.app/)

**API Endpoint:** [https://taskflow-server-l2z9.onrender.com/](https://taskflow-server-l2z9.onrender.com/)

---

## 📋 Description

TaskFlow is a full-stack web application built with the MERN stack that allows freelancers to manage their daily tasks, organize projects, and maintain control of their work with a clean and intuitive interface.

This project was developed as part of my professional portfolio, following agile methodologies with 2-week sprints, user stories with acceptance criteria, and Git workflow with feature branches.

---

## ✨ Features

### 🎯 Sprint 1 - Core Functionality (COMPLETED)

**Authentication & Security:**

-   ✅ User registration with email validation
-   ✅ Secure login with JWT authentication
-   ✅ Password encryption with bcrypt
-   ✅ Protected routes (frontend and backend)
-   ✅ Token-based session management

**Task Management:**

-   ✅ Create, read, update, and delete tasks
-   ✅ Task states: To Do, In Progress, Done
-   ✅ Quick status change with dropdown
-   ✅ Delete confirmation modal
-   ✅ Timestamps (created/updated dates)

**User Interface:**

-   ✅ Professional UI with Tailwind CSS
-   ✅ Responsive design (mobile-first)
-   ✅ Navigation bar with hamburger menu
-   ✅ Landing page
-   ✅ Smooth transitions and animations
-   ✅ Loading states and error handling

---

### 🚀 Sprint 2 - Advanced Features (COMPLETED)

**Search & Filtering:**

-   ✅ Text-based search with debounce (min. 3 characters)
-   ✅ Filter by status (To Do, In Progress, Done)
-   ✅ Filter by priority (Low, Medium, High)
-   ✅ Filter by tags with clickeable chips
-   ✅ Combined filters (search + status + priority + tags)
-   ✅ URL query parameters for all filters

**Priority Management:**

-   ✅ Priority levels: Low, Medium, High
-   ✅ Visual priority badges with color coding
-   ✅ Priority dropdown in task cards
-   ✅ Filter buttons for each priority level

**Tags System:**

-   ✅ Add/remove tags to tasks
-   ✅ Tag input with Enter key support
-   ✅ Visual tag chips with # prefix
-   ✅ Click tags to filter tasks
-   ✅ Dynamic tag list based on existing tasks
-   ✅ Duplicate prevention

**Calendar Dashboard:**

-   ✅ Visual calendar in Home page
-   ✅ Month, week, and day views
-   ✅ Task scheduling with start/end dates
-   ✅ Color-coded events by priority
-   ✅ Duration blocks for tasks
-   ✅ Click task to view details
-   ✅ Opacity for completed tasks

---

### 💡 Future Enhancements

-   Time estimation and tracking
-   Multiple projects/workspaces
-   Team collaboration features
-   Dark mode
-   Export to CSV/PDF
-   Email notifications
-   Recurring tasks
-   Subtasks

---

## 🛠️ Tech Stack

### Frontend

-   **React** 18.3 with Vite
-   **React Router** 6+ for navigation
-   **Axios** for HTTP requests
-   **Tailwind CSS** for styling
-   **React Big Calendar** for calendar view
-   **Moment.js** for date handling

### Backend

-   **Node.js** 20+ LTS
-   **Express** 4.19+
-   **MongoDB** 8+ with Atlas
-   **Mongoose** 8+ ODM
-   **JWT** for authentication
-   **bcryptjs** for password hashing

### DevOps

-   **Frontend:** Vercel (automatic deployments)
-   **Backend:** Render (automatic deployments)
-   **Database:** MongoDB Atlas (cloud)
-   **Version Control:** Git & GitHub

---

## 📁 Project Structure

This is a monorepo containing both frontend and backend:

```
taskflow/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Calendar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── pages/         # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   ├── services/      # API integration
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Backend (Node + Express)
│   ├── config/           # Configuration files
│   │   └── db.js
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/       # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/          # Mongoose schemas
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   └── server.js
│
├── LICENSE
├── README.md
└── package.json
```

---

## 🚀 Local Development Setup

### Prerequisites

-   Node.js 20+ installed
-   MongoDB Atlas account (or local MongoDB)
-   pnpm, npm or yarn

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/martinlpc/taskflow.git
cd taskflow
```

2. **Backend Setup:**

```bash
cd server
npm install

# Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Start server
npm run dev
```

Server will run at `http://localhost:5000`

3. **Frontend Setup:**

```bash
cd client
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api

# Start application
npm run dev
```

Application will be available at `http://localhost:5173`

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | No            |
| POST   | `/api/auth/login`    | Login user        | No            |

### Task Endpoints

| Method | Endpoint                   | Description                 | Auth Required |
| ------ | -------------------------- | --------------------------- | ------------- |
| GET    | `/api/tasks`               | Get all user's tasks        | Yes           |
| GET    | `/api/tasks?status=todo`   | Filter tasks by status      | Yes           |
| GET    | `/api/tasks?priority=high` | Filter tasks by priority    | Yes           |
| GET    | `/api/tasks?tags=bug`      | Filter tasks by tag         | Yes           |
| GET    | `/api/tasks?search=fix`    | Search in title/description | Yes           |
| POST   | `/api/tasks`               | Create new task             | Yes           |
| PUT    | `/api/tasks/:id`           | Update task                 | Yes           |
| DELETE | `/api/tasks/:id`           | Delete task                 | Yes           |

### Query Parameters

-   `status`: Filter by status (`todo`, `in_progress`, `done`)
-   `priority`: Filter by priority (`low`, `medium`, `high`)
-   `tags`: Filter by tag (single tag)
-   `search`: Search in title and description (min. 3 characters)

Multiple filters can be combined: `/api/tasks?status=todo&priority=high&search=bug`

---

## 🗄️ Data Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in_progress', 'done'], default: 'todo'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  tags: [String],
  dueDate: Date (optional),
  startDate: Date (optional),
  endDate: Date (optional),
  userId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

The application has been manually tested for:

-   ✅ User registration and login flows
-   ✅ Task CRUD operations
-   ✅ All filter combinations (status, priority, tags, search)
-   ✅ Calendar view with scheduled tasks
-   ✅ Authentication and authorization
-   ✅ Error handling and validation
-   ✅ Responsive design on multiple devices
-   ✅ URL parameter persistence

Automated testing suite coming in future updates.

---

## 🎨 Design Decisions

### Why MERN Stack?

-   **MongoDB:** Flexible schema for evolving task requirements
-   **Express:** Lightweight and unopinionated backend framework
-   **React:** Component-based architecture for maintainable UI
-   **Node.js:** JavaScript everywhere for consistent development

### Why Tailwind CSS?

-   Utility-first approach for rapid UI development
-   Consistent design system out of the box
-   Easy to customize and extend
-   Excellent mobile-first responsive design

### Why React Big Calendar?

-   Professional calendar UI with multiple views
-   Visual task duration blocks
-   Month, week, and day views
-   Customizable event styling

### Architecture Patterns

-   **RESTful API:** Standard HTTP methods and status codes
-   **JWT Authentication:** Stateless and scalable auth
-   **Separation of Concerns:** Clear separation between routes, controllers, and models
-   **Protected Routes:** Both frontend and backend validation
-   **Component Composition:** Reusable React components
-   **Query Parameters:** Shareable and bookmarkable filters

---

## 📦 Deployment

### Production Environment

**Frontend (Vercel):**

-   Automatic deployments from `main` branch
-   Environment variable: `VITE_API_URL`
-   Custom domain ready
-   Instant rollbacks

**Backend (Render):**

-   Automatic deployments from `main` branch
-   Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
-   Free tier with auto-sleep (may have cold starts)
-   Health checks enabled

**Database (MongoDB Atlas):**

-   Cloud-hosted MongoDB cluster
-   Automatic backups
-   Connection pooling enabled
-   M0 Free tier

---

## 🤝 Contributing

While this is primarily a portfolio project, suggestions and feedback are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Development Process

This project was built following:

-   ✅ Agile methodology with 2-week sprints
-   ✅ User Stories with acceptance criteria
-   ✅ Git workflow with feature branches
-   ✅ Semantic commit messages
-   ✅ Code reviews via Pull Requests
-   ✅ Continuous deployment pipeline

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Martín Pacheco**

-   GitHub: [@martinlpc](https://github.com/martinlpc)
-   LinkedIn: [Martin Pacheco](https://linkedin.com/in/martinlpacheco)

---

## 🙏 Acknowledgments

-   Project developed as part of my professional portfolio
-   Inspired by modern task management applications
-   Built with best practices from the MERN development community
-   Special thanks to the open-source community for amazing tools

---

## 🔮 Roadmap

### Completed (Sprint 1 & 2)

-   [x] Complete authentication system
-   [x] Full CRUD operations
-   [x] Advanced filtering and search
-   [x] Priority management
-   [x] Tags system
-   [x] Calendar dashboard

### Future Updates

-   [ ] Automated testing (Jest + React Testing Library)
-   [ ] Time tracking functionality
-   [ ] Dark mode
-   [ ] Team collaboration features
-   [ ] Mobile app (React Native)
-   [ ] Integration with third-party tools

---

## 📊 Project Stats

-   **Total Development Time:** ~40 hours
-   **Lines of Code:** ~3,500+
-   **Commits:** 35+
-   **Pull Requests:** 13
-   **Sprints Completed:** 2
-   **User Stories Completed:** 13
-   **Current Version:** 2.0.0 (Sprint 2 Complete)

---

⭐️ If you find this project useful or interesting, please consider giving it a star on GitHub!

**Live Demo:** [https://taskflow-mp.vercel.app/](https://taskflow-mp.vercel.app/)
