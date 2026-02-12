import { Router } from 'express'

export const healthRoutes = (prisma) => {
    const router = Router()

    router.get('/', async (req, res) => {
        try {
            await prisma.$queryRaw`SELECT 1`
            return res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                database: 'connected'
            })
        } catch (error) {
            console.error('Healthcheck failed:', error)
            return res.status(503).json({
                status: 'error',
                timestamp: new Date().toISOString(),
                database: 'unavailable',
                message: 'Database unreachable'
            })
        }
    })

    return router
}
