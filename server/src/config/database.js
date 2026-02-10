import { PrismaClient } from '../generated/prisma_client/client.ts'
//import { PrismaPg } from '@prisma/adapter-pg'

// const adapter = new PrismaPg({
//     connectionString: process.env.DATABASE_URL
// })

// const globalForPrisma = globalThis


// const prisma = globalForPrisma ||
//     new PrismaClient({
//         adapter
//     })

// if (process.env.NODE_ENV !== 'production') {
//     globalForPrisma.prisma = prisma
// }

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error']
})

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