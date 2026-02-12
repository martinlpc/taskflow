import { PrismaClient } from '@prisma/client'

const prismaLogEnv = process.env.PRISMA_LOG_LEVEL
const prismaLogLevels = prismaLogEnv
    ? prismaLogEnv.split(',').map((level) => level.trim()).filter(Boolean)
    : (process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'])

const prisma = new PrismaClient({
    log: prismaLogLevels
})

let prismaConnected = false

export const connectDB = async () => {
    if (prismaConnected) {
        return
    }

    try {
        await prisma.$connect()
        prismaConnected = true
        console.log('Database connected')
    } catch (error) {
        console.error('Failed to connect to the database', error)
        throw error
    }
}

process.on('beforeExit', async () => {
    await prisma.$disconnect()
})

process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
})


export default prisma
