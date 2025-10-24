import { Router } from 'express'
import { register } from '../controllers/auth.controller.js'

const authRoutes = Router()

authRoutes.post('/register', register)

export default authRoutes