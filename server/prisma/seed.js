import prisma from '../src/config/database.js'
import bcrypt from 'bcryptjs'

async function main() {
    console.log('🌱 Seeding database...')

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10)

    const user = await prisma.user.create({
        data: {
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            tasks: {
                create: [
                    {
                        title: 'Completar migración a PostgreSQL',
                        description: 'Migrar todos los modelos de Mongoose a Prisma',
                        status: 'in_progress',
                        priority: 'high',
                        tags: ['backend', 'database']
                    },
                    {
                        title: 'Configurar Docker',
                        description: 'Setup de Docker Compose para desarrollo',
                        status: 'done',
                        priority: 'high',
                        tags: ['devops', 'docker']
                    }
                ]
            }
        },
        include: {
            tasks: true
        }
    })

    console.log('✅ User created:', user)
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })