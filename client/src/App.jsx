import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Tasks from "./pages/Tasks"
import PrivateRoute from "./pages/PrivateRoute"
import PublicRoute from "./pages/PublicRoute"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - if not signed in */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* Private routes - if signed in */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        {/* Route 404 - redirects if logged or not */}
        <Route
          path="*"
          element={
            localStorage.getItem('token')
              ? <Navigate to="/" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
