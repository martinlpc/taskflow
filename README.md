# TaskFlow

> A modern and minimalist Task Manager for freelancers who need to organize their work efficiently.

[![Status](https://img.shields.io/badge/status-MVP%20deployed-success)](https://taskflow-inky-pi.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node-20+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Live Demo

**Try it now:** [https://taskflow-inky-pi.vercel.app/](https://taskflow-inky-pi.vercel.app/)

**API Endpoint:** [https://taskflow-server-l2z9.onrender.com/](https://taskflow-server-l2z9.onrender.com/)

---

## 📋 Description

TaskFlow is a full-stack web application built with the MERN stack that allows freelancers to manage their daily tasks, organize projects, and maintain control of their work with a clean and intuitive interface.

This project was developed as part of my professional portfolio, following agile methodologies and best practices in modern web development.

---

## ✨ Features

### 🎯 Sprint 1 - MVP (COMPLETED)

**Authentication & Security:**

-   ✅ User registration with email validation
-   ✅ Secure login with JWT authentication
-   ✅ Password encryption with bcrypt
-   ✅ Protected routes (frontend and backend)
-   ✅ Token-based session management

**Task Management:**

-   ✅ Create, read, update, and delete tasks
-   ✅ Task states: To Do, In Progress, Done
-   ✅ Priority levels: Low, Medium, High
-   ✅ Quick status change with dropdown
-   ✅ Delete confirmation modal
-   ✅ Filter tasks by status
-   ✅ Timestamps (created/updated dates)

**User Interface:**

-   ✅ Professional UI with Tailwind CSS
-   ✅ Responsive design (mobile-first)
-   ✅ Navigation bar with hamburger menu
-   ✅ Landing page
-   ✅ Smooth transitions and animations
-   ✅ Loading states and error handling

### 🔄 Sprint 2 - Coming Soon

-   🔜 Text-based search functionality
-   🔜 Filter by priority
-   🔜 Tags management with UI
-   🔜 Calendar view for tasks
-   🔜 Dashboard with visual metrics

### 💡 Future Enhancements

-   Time estimation and tracking
-   Multiple projects/workspaces
-   Team collaboration features
-   Dark mode
-   Export to CSV/PDF
-   Email notifications

---

## 🛠️ Tech Stack

### Frontend

-   **React** 18.3 with Vite
-   **React Router** 6+ for navigation
-   **Axios** for HTTP requests
-   **Tailwind CSS** for styling
-   **Lucide React** for icons

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
cat > .env << EOF
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EOF

# Start server
npm run dev
```

Server will run at `http://localhost:5000`

3. **Frontend Setup:**

```bash
cd client
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

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

| Method | Endpoint                 | Description            | Auth Required |
| ------ | ------------------------ | ---------------------- | ------------- |
| GET    | `/api/tasks`             | Get all user's tasks   | Yes           |
| GET    | `/api/tasks?status=todo` | Filter tasks by status | Yes           |
| POST   | `/api/tasks`             | Create new task        | Yes           |
| PUT    | `/api/tasks/:id`         | Update task            | Yes           |
| DELETE | `/api/tasks/:id`         | Delete task            | Yes           |

### Query Parameters

-   `status`: Filter by status (`todo`, `in_progress`, `done`)
-   `priority`: Filter by priority (`low`, `medium`, `high`) - _Coming in Sprint 2_
-   `search`: Search in title and description - _Coming in Sprint 2_

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
  dueDate: Date (optional),
  tags: [String] (optional),
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
-   ✅ Status filtering
-   ✅ Authentication and authorization
-   ✅ Error handling and validation
-   ✅ Responsive design on multiple devices

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

### Architecture Patterns

-   **RESTful API:** Standard HTTP methods and status codes
-   **JWT Authentication:** Stateless and scalable auth
-   **Separation of Concerns:** Clear separation between routes, controllers, and models
-   **Protected Routes:** Both frontend and backend validation

---

## 📦 Deployment

### Production Environment

**Frontend (Vercel):**

-   Automatic deployments from `main` branch
-   Environment variable: `VITE_API_URL`
-   Custom domain ready

**Backend (Render):**

-   Automatic deployments from `main` branch
-   Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
-   Free tier with auto-sleep (may have cold starts)

**Database (MongoDB Atlas):**

-   Cloud-hosted MongoDB cluster
-   Automatic backups
-   Connection pooling enabled

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

### Q1 2026

-   [ ] Complete Sprint 2 features
-   [ ] Add automated testing (Jest + React Testing Library)
-   [ ] Implement dashboard with analytics
-   [ ] Add dark mode

### Q2 2026

-   [ ] Team collaboration features
-   [ ] Time tracking functionality
-   [ ] Mobile app (React Native)
-   [ ] Integration with third-party tools

---

⭐️ If you find this project useful or interesting, please consider giving it a star on GitHub!

**Live Demo:** [https://taskflow-inky-pi.vercel.app/](https://taskflow-inky-pi.vercel.app/)
