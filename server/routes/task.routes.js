import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createTask } from "../controllers/task.controller.js";

const taskRoutes = Router()

taskRoutes.use(authMiddleware)

// vvv Routes vvv
taskRoutes.post('/', createTask)

export default taskRoutes