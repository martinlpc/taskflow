import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createTask, getTasks } from "../controllers/task.controller.js";

const taskRoutes = Router()

taskRoutes.use(authMiddleware)

// vvv Routes vvv
taskRoutes.post('/', createTask)
taskRoutes.get('/', getTasks)

export default taskRoutes