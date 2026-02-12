import express from 'express';
import cors from 'cors'
import prisma, { connectDB } from './src/config/database.js'
import authRoutes from './src/routes/auth.routes.js'
import taskRoutes from './src/routes/task.routes.js';
import { healthRoutes } from './src/routes/health.routes.js'

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // No terminamos el proceso, solo logueamos
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Solo terminamos en casos críticos
    if (error.code === 'MODULE_NOT_FOUND' || error.code === 'ERR_MODULE_NOT_FOUND') {
        console.error('FATAL: Module not found. Check your imports.');
        process.exit(1);
    }
});

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

// vvv ROUTES vvv
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/health', healthRoutes(prisma))

app.get('/', (req, res) => {
    res.status(200).json({
        response: 'server running',
    })
})

// Manejo de errores de Express
app.use((err, req, res, next) => {
    console.error('Express Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const startServer = async () => {
    try {
        await connectDB()
    } catch (error) {
        console.error('FATAL ERROR: Database connection failed', error)
        process.exit(1)
    }

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        } else {
            console.error('Server error:', error);
        }
    })
}

startServer()
