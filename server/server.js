import express from 'express';
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express()
const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT secret is not configured')
    process.exit(1)
}

// vvv MIDDLEWARES vvv
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))
connectDB()

// vvv ROUTES vvv
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        response: 'server running',
    })
})


// Launch
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})