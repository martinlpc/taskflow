# TaskFlow

> A modern and minimalist Task Manager for freelancers who need to organize their work efficiently.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![React](https://img.shields.io/badge/React-18.3-blue)
![Node](https://img.shields.io/badge/Node-20+-green)

## 📋 Description

TaskFlow is a full-stack web application built with the MERN stack that allows freelancers to manage their daily tasks, organize projects, and maintain control of their work with a clean and intuitive interface.

## ✨ Features

### Sprint 1 - COMPLETED ✅

-   Complete authentication with JWT
-   Full CRUD for tasks
-   Quick status change with dropdown
-   Task priorities (Low, Medium, High)
-   Status filtering
-   Delete with confirmation modal
-   Professional UI with Tailwind CSS
-   Responsive design with navbar

### Coming Soon 🔄

-   Text search functionality
-   Priority and tags filters UI
-   Calendar view
-   Dashboard with metrics

## 🛠️ Tech Stack

### Frontend

-   **React** 18.3+ with Vite
-   **React Router** 6+
-   **Axios** for HTTP requests
-   **Tailwind CSS** for styling

### Backend

-   **Node.js** 20+ LTS
-   **Express** 4.19+
-   **MongoDB** 8+ (MongoDB Atlas)
-   **Mongoose** 8+ ODM
-   **JWT** for authentication
-   **bcrypt** for encryption

## 📁 Project Structure

This is a monorepo containing both frontend and backend:

-   `/client` - React frontend application
-   `/server` - Node.js/Express backend API

Each folder has its own README with specific setup instructions.

```
taskflow/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Main pages
│   │   ├── services/      # API calls
│   │   ├── context/       # Context API
│   │   ├── utils/         # Utilities
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Backend Node + Express
│   ├── controllers/       # Business logic
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/       # Middlewares
│   ├── config/           # Configuration
│   └── server.js
│
└── README.md
```

## 🚀 Installation and Usage

### Prerequisites

-   Node.js 20+ installed
-   MongoDB Atlas account (or local MongoDB)
-   pnpm, npm or yarn

### Clone the repository

```bash
git clone https://github.com/martinlpc/taskflow.git
cd taskflow
```

### Backend Setup

1. Navigate to server folder:

```bash
cd server
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env` file in `/server` root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_secret_key
NODE_ENV=development
```

4. Start server:

```bash
npm run dev
```

Server will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to client folder:

```bash
cd client
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env` file in `/client` root:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start application:

```bash
pnpm run dev
```

Application will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login
```

### Tasks (authentication required)

```
GET    /api/tasks            - Get all user's tasks
POST   /api/tasks            - Create new task
GET    /api/tasks/:id        - Get specific task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
```

### Query Parameters

-   `status`: Filter by status (todo, in_progress, done)
-   `priority`: Filter by priority (low, medium, high)
-   `search`: Search in title and description
-   `tags`: Filter by tags

## 🗄️ Data Models

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task

```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in_progress', 'done']),
  priority: String (enum: ['low', 'medium', 'high']),
  dueDate: Date,
  tags: [String],
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

```bash
# Backend tests
cd server
pnpm test

# Frontend tests
cd client
pnpm test
```

## 📦 Deployment

### Backend (Render / Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Configure environment variables
4. Automatic deploy from main branch

### Frontend (Vercel / Netlify)

1. Connect GitHub repository
2. Set build command: `pnpm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT License. See `LICENSE` file for details.

## 👤 Author

Martín Pacheco

-   GitHub: [@martinlpc](https://github.com/martinlpc)
-   LinkedIn: [Martin Pacheco](https://linkedin.com/in/martinlpacheco)

## 🙏 Acknowledgments

-   Project created as part of my professional portfolio
-   Inspired by best practices in full-stack MERN development

---

⭐️ If you find this project useful, give it a star on GitHub!
