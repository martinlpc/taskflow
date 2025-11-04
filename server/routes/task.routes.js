import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createTask, getTasks, updateTask } from "../controllers/task.controller.js";

const taskRoutes = Router()

taskRoutes.use(authMiddleware)

// vvv Routes vvv
taskRoutes.post('/', createTask)
taskRoutes.get('/', getTasks)
taskRoutes.put('/:id', updateTask)

export default taskRoutes