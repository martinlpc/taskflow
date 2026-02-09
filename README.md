# 🚀 TaskFlow API - Backend

> Sistema de gestión de tareas con autenticación JWT, construido con Node.js, Express y PostgreSQL.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
    - [Opción 1: Con Docker (Recomendado)](#opción-1-con-docker-recomendado)
    - [Opción 2: Sin Docker](#opción-2-sin-docker)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Migraciones](#-migraciones-de-base-de-datos)
- [Contribución](#-contribución)

---

## ✨ Características

- ✅ **Autenticación JWT** - Sistema seguro de autenticación y autorización
- ✅ **CRUD Completo** - Gestión completa de tareas (crear, leer, actualizar, eliminar)
- ✅ **Gestión de Usuarios** - Registro e inicio de sesión
- ✅ **Prioridades y Estados** - Organización de tareas por prioridad y estado
- ✅ **Fechas y Deadlines** - Seguimiento de fechas de inicio, fin y vencimiento
- ✅ **Tags/Etiquetas** - Categorización flexible de tareas
- ✅ **Containerización** - Docker y Docker Compose para desarrollo y producción
- ✅ **Type-Safety** - Prisma ORM con generación de tipos
- ✅ **Database Migrations** - Control de versiones del schema
- ✅ **Health Checks** - Endpoints de monitoreo

---

## 🛠️ Stack Tecnológico

### Backend

- **Runtime:** Node.js 20.x
- **Framework:** Express 5.1.0
- **Base de Datos:** PostgreSQL 16
- **ORM:** Prisma (latest)
- **Autenticación:** JWT (jsonwebtoken 9.0.2)
- **Encriptación:** bcryptjs 3.0.2
- **CORS:** cors 2.8.5

### DevOps

- **Containerización:** Docker & Docker Compose
- **Cloud Database:** Neon.tech (PostgreSQL Serverless)
- **Hosting:** Fly.io
- **CI/CD:** GitHub Actions

---

## 🏗 Arquitectura

```
taskflow/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma          # Definición del schema de BD
│   │   └── migrations/            # Historial de migraciones
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Cliente Prisma
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   └── utils/
│   │       └── validators.js
│   ├── Dockerfile                 # Multi-stage build para producción
│   ├── docker-compose.yml         # Stack completo para desarrollo
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js                  # Entry point
│   └── .env.example
└── README.md
```

### Esquema de Base de Datos

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      Status    @default(todo)
  priority    Priority  @default(medium)
  dueDate     DateTime?
  startDate   DateTime?
  endDate     DateTime?
  tags        String[]
  userId      Int
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Status {
  todo
  in_progress
  done
}

enum Priority {
  low
  medium
  high
}
```

---

## 📦 Requisitos Previos

### Con Docker (Opción Recomendada)

- Docker 20.x o superior
- Docker Compose 2.x o superior

### Sin Docker

- Node.js 20.x o superior
- PostgreSQL 16 o superior
- pnpm o yarn

---

## 🚀 Instalación

### Opción 1: Con Docker (Recomendado)

**1. Clonar el repositorio**

```bash
git clone https://github.com/martinlpc/taskflow.git
cd taskflow/server
```

**2. Crear archivo de variables de entorno**

```bash
cp .env.example .env
```

**3. Levantar los contenedores**

```bash
docker-compose up -d
```

**4. Ejecutar migraciones**

```bash
docker-compose exec api npx prisma migrate deploy
```

**5. (Opcional) Seed de datos de prueba**

```bash
docker-compose exec api npx prisma db seed
```

✅ **La API estará corriendo en `http://localhost:3000`**

---

### Opción 2: Sin Docker

**1. Clonar el repositorio**

```bash
git clone https://github.com/martinlpc/taskflow.git
cd taskflow/server
```

**2. Instalar dependencias**

```bash
pnpm install
```

**3. Configurar PostgreSQL**

```bash
# Crear base de datos
createdb taskflow_db

# O usando psql
psql -U postgres
CREATE DATABASE taskflow_db;
\q
```

**4. Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

**5. Generar Prisma Client**

```bash
pnpx prisma generate
```

**6. Ejecutar migraciones**

```bash
pnpx prisma migrate deploy
```

**7. Iniciar el servidor**

```bash
# Desarrollo
pnpm run dev

# Producción
pnpm start
```

---

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/taskflow_db"

# JWT
JWT_SECRET="tu_super_secreto_jwt_cambiar_en_produccion"

# Server
NODE_ENV="development"
PORT=3000

# CORS (opcional)
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### Ejemplo de `.env.example`

```env
DATABASE_URL="postgresql://taskflow:dev_password_123@localhost:5432/taskflow_db"
JWT_SECRET="change_this_in_production_use_strong_secret"
NODE_ENV="development"
PORT=3000
```

---

## 💻 Uso

### Comandos Docker

```bash
# Levantar todo el stack
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f api

# Detener contenedores
docker-compose down

# Reiniciar API sin afectar la BD
docker-compose restart api

# Ejecutar comandos dentro del contenedor
docker-compose exec api npm run dev

# Acceder al shell del contenedor
docker-compose exec api sh

# Resetear base de datos completamente
docker-compose down -v
docker-compose up -d
```

### Comandos NPM

```bash
# Desarrollo con hot-reload
pnpm run dev

# Producción
pnpm start

# Ejecutar tests
pnpm test

# Generar Prisma Client
pnpx prisma generate

# Crear nueva migración
pnpx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
pnpx prisma migrate deploy

# Abrir Prisma Studio (GUI de BD)
pnpx prisma studio
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Autenticación

| Método | Endpoint         | Descripción             | Auth Required |
| ------ | ---------------- | ----------------------- | ------------- |
| POST   | `/auth/register` | Registrar nuevo usuario | ❌            |
| POST   | `/auth/login`    | Iniciar sesión          | ❌            |

**Ejemplo - Registro:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com"
    }
}
```

---

### Tareas

| Método | Endpoint     | Descripción                          | Auth Required |
| ------ | ------------ | ------------------------------------ | ------------- |
| GET    | `/tasks`     | Obtener todas las tareas del usuario | ✅            |
| GET    | `/tasks/:id` | Obtener tarea específica             | ✅            |
| POST   | `/tasks`     | Crear nueva tarea                    | ✅            |
| PUT    | `/tasks/:id` | Actualizar tarea                     | ✅            |
| DELETE | `/tasks/:id` | Eliminar tarea                       | ✅            |

**Ejemplo - Crear Tarea:**

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Completar migración a PostgreSQL",
    "description": "Migrar base de datos de MongoDB a PostgreSQL",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "tags": ["backend", "database", "migration"]
  }'
```

**Respuesta:**

```json
{
    "id": 1,
    "title": "Completar migración a PostgreSQL",
    "description": "Migrar base de datos de MongoDB a PostgreSQL",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "startDate": null,
    "endDate": null,
    "tags": ["backend", "database", "migration"],
    "userId": 1,
    "createdAt": "2026-02-06T10:30:00.000Z",
    "updatedAt": "2026-02-06T10:30:00.000Z"
}
```

---

### Health Check

| Método | Endpoint  | Descripción         | Auth Required |
| ------ | --------- | ------------------- | ------------- |
| GET    | `/health` | Estado del servidor | ❌            |

```bash
curl http://localhost:3000/health
```

**Respuesta:**

```json
{
    "status": "ok",
    "timestamp": "2026-02-06T10:30:00.000Z",
    "database": "connected"
}
```

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Estructura de Tests

```
tests/
├── integration/
│   ├── auth.test.js
│   └── tasks.test.js
├── unit/
│   ├── controllers/
│   └── utils/
└── setup.js
```

---

## 🌐 Deployment

### Fly.io (Recomendado)

**1. Instalar Fly CLI**

```bash
curl -L https://fly.io/install.sh | sh
```

**2. Login**

```bash
fly auth login
```

**3. Crear aplicación**

```bash
fly launch
```

**4. Configurar secretos**

```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set JWT_SECRET="..."
```

**5. Deploy**

```bash
fly deploy
```

**6. Verificar**

```bash
fly status
fly logs
```

---

### Railway.app (Alternativa)

**1. Instalar Railway CLI**

```bash
npm install -g @railway/cli
```

**2. Login**

```bash
railway login
```

**3. Inicializar proyecto**

```bash
railway init
```

**4. Agregar PostgreSQL**

```bash
railway add --database postgresql
```

**5. Deploy**

```bash
railway up
```

---

### Variables de Entorno en Producción

```bash
# Fly.io
fly secrets set KEY=value

# Railway
railway variables set KEY=value

# Render
# Via dashboard web
```

**Secretos requeridos:**

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

---

## 🔄 Migraciones de Base de Datos

### Crear Nueva Migración

```bash
# Desarrollo
npx prisma migrate dev --name add_task_categories

# Esto crea:
# 1. Archivo de migración SQL
# 2. Aplica cambios a BD local
# 3. Regenera Prisma Client
```

### Aplicar Migraciones en Producción

```bash
npx prisma migrate deploy
```

### Resetear Base de Datos (⚠️ Desarrollo solamente)

```bash
npx prisma migrate reset
```

### Ver Estado de Migraciones

```bash
npx prisma migrate status
```

---

## 🗂️ Scripts Disponibles

```json
{
    "start": "node server.js",
    "dev": "node --env-file .env --watch server.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:studio": "npx prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f api"
}
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convención de Commits

```
Add: nueva funcionalidad
Fix: corrección de bug
Update: actualización de código existente
Refactor: refactorización de código
Docs: cambios en documentación
Test: agregar o actualizar tests
```

---

## 📝 Roadmap

- [x] Migración de MongoDB a PostgreSQL
- [x] Implementación de Prisma ORM
- [x] Dockerización completa
- [x] Deploy en Fly.io
- [ ] GitHub Actions CI/CD
- [ ] Tests unitarios e integración
- [ ] Documentación API con Swagger
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Monitoreo con Sentry

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Martín Contreras**

- GitHub: [@martinlpc](https://github.com/martinlpc)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- [Prisma](https://www.prisma.io/) por el excelente ORM
- [Neon](https://neon.tech/) por PostgreSQL serverless gratuito
- [Fly.io](https://fly.io/) por el hosting generoso

---

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Fly.io](https://fly.io/docs/)

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub**
