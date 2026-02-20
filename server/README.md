# TaskFlow — Server

> API REST de TaskFlow v2.0: migración de MongoDB/Mongoose a **PostgreSQL + Prisma ORM**, con soporte Docker nativo y Node.js 20+ sin dependencias de build.

---

## 🛠️ Tech Stack

| Tecnología           | Versión  | Rol                               |
| -------------------- | -------- | --------------------------------- |
| **Node.js**          | ≥ 20.0.0 | Runtime                           |
| **Express**          | 5.1.0    | HTTP framework                    |
| **PostgreSQL**       | 16+      | Base de datos relacional          |
| **Prisma ORM**       | 5.22.0   | Query builder + migraciones       |
| **Docker + Compose** | —        | Base de datos local en contenedor |
| **JWT**              | 9.0.2    | Autenticación stateless           |
| **bcryptjs**         | 3.0.2    | Hashing de contraseñas            |

### ¿Por qué estas elecciones?

**PostgreSQL sobre MongoDB** es el corazón de esta migración. MongoDB (schema-less) es conveniente para prototipar, pero introduce problemas a medida que la app crece: sin relaciones formales, sin constraints, sin transacciones ACID reales. PostgreSQL garantiza integridad referencial, permite queries complejas con JOINs eficientes, y es más predecible en producción. Para un task manager donde las relaciones `User → Task` son centrales, el modelo relacional es la elección correcta.

> **Trade-off:** la migración implica definir el schema de antemano (menos flexibilidad inicial), pero a cambio se gana consistencia de datos y performance en queries complejas.

**Prisma 5** sobre Sequelize o TypeORM porque ofrece el mejor developer experience del ecosistema: schema declarativo en `prisma/schema.prisma`, cliente tipado autogenerado, y migraciones versionadas automáticas. La carpeta `src/generated/` contiene el cliente Prisma generado que no debe modificarse manualmente.

> **Trade-off:** Prisma genera un cliente específico para el schema actual. Cada cambio al schema requiere correr `prisma migrate dev` para generar una nueva migración y regenerar el cliente. Esto agrega un paso al workflow, pero garantiza que el código siempre esté en sync con la DB.

**Express 5** (en GA desde finales de 2024) sobre Fastify o Hono porque el ecosistema de middlewares es el más maduro y el equipo ya lo conoce. Express 5 agrega manejo de errores async nativo (ya no se necesita `express-async-errors` o wrappers manuales).

**bcryptjs** sobre `bcrypt` (nativo) porque no requiere compilación de código nativo (node-gyp), lo que simplifica el setup en Docker y en CI/CD. El costo es una performance ligeramente menor, irrelevante para el volumen de auth de esta app.

**Node.js 20 LTS con `--watch`** para desarrollo en lugar de `nodemon`. Desde Node 18+, el flag `--watch` es parte del core y recarga el proceso ante cambios de archivos sin dependencias adicionales. También se usa `--env-file .env` (Node 20.6+) para cargar variables de entorno sin `dotenv` en runtime de producción.

> **Nota:** `dotenv` sigue como dependencia porque Prisma lo requiere internamente para leer `DATABASE_URL` durante las migraciones.

---

## 📁 Estructura de carpetas

```
server/
├── prisma/
│   ├── migrations/         # Historial de migraciones SQL (versionado con git)
│   ├── schema.prisma       # Definición del schema: modelos, relaciones, provider
│   └── seed.js             # Script para poblar la DB con datos de prueba
├── src/
│   ├── config/             # Configuración global (DB connection, variables de entorno)
│   ├── controllers/        # Lógica de negocio — handlers de cada endpoint
│   ├── generated/          # Cliente Prisma autogenerado (NO editar manualmente)
│   ├── middleware/         # Auth JWT, validación, manejo de errores
│   └── routes/             # Definición de rutas Express y mapeo a controllers
├── tests/
│   └── health.test.js      # Tests de integración con Node test runner nativo
├── .dockerignore
├── .env                    # Variables locales (no commitear)
├── .env.example            # Template de variables requeridas (sí commitear)
├── .gitignore
├── docker-compose.yml      # Servicios Docker: postgres + (opcional) pgAdmin
├── Dockerfile              # Imagen de producción del servidor
├── package.json
├── pnpm-lock.yaml
└── server.js               # Entry point — inicializa Express y monta rutas
```

### Decisiones de arquitectura

- **`prisma/migrations/`** se versiona con git. Esto es fundamental: cada migración es un archivo SQL inmutable que representa un cambio específico al schema. En producción, se corre `prisma migrate deploy` (no `dev`) para aplicar solo las migraciones pendientes sin interactividad.

- **`src/generated/`** contiene el Prisma Client generado. Se excluye del control de versiones pero se regenera en cada setup con `pnpm prisma:generate`. En Docker, el Dockerfile incluye este paso.

- **Controllers** separados de **Routes** sigue el patrón MVC: las rutas solo mapean HTTP a funciones, los controllers contienen la lógica. Esto hace el código testeable de forma unitaria.

- **`tests/`** usa el **Node.js test runner nativo** (`node --test`) disponible desde Node 18, sin necesidad de Jest o Vitest. Para una suite de tests de integración/health checks, es suficiente y elimina una dependencia de dev.

---

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz de `/server` copiando `.env.example`:

```bash
cp .env.example .env
```

Variables requeridas:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos PostgreSQL
DATABASE_URL="postgresql://taskflow_user:taskflow_pass@localhost:5432/taskflow_db?schema=public"

# Autenticación
JWT_SECRET=tu_secreto_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d
```

> ⚠️ `DATABASE_URL` sigue el formato de connection string de PostgreSQL. Si usás Docker Compose, el host es `localhost` desde fuera del contenedor y `postgres` (nombre del servicio) desde dentro.

---

## 🐳 Docker — Base de datos local

El flujo recomendado para desarrollo es levantar **solo la base de datos en Docker** y correr el servidor Node.js directamente en el host. Esto permite HMR y debugging más sencillos.

### Levantar PostgreSQL

```bash
pnpm docker:up
```

Esto levanta un contenedor PostgreSQL con los datos del `.env`. El volumen de datos persiste entre reinicios.

### Scripts de Docker

| Script              | Descripción                                              |
| ------------------- | -------------------------------------------------------- |
| `pnpm docker:up`    | Levanta los servicios en background (`-d`)               |
| `pnpm docker:down`  | Detiene y elimina los contenedores (datos persisten)     |
| `pnpm docker:logs`  | Muestra logs en tiempo real                              |
| `pnpm docker:reset` | Destruye volúmenes y reinicia (⚠️ borra todos los datos) |

> **¿Por qué Docker para la DB local?** Evita instalar PostgreSQL en el sistema operativo, permite tener distintas versiones por proyecto, y garantiza paridad con el entorno de producción.

---

## 🗃️ Prisma — Gestión de la base de datos

### Flujo de trabajo con migraciones

```bash
# 1. Modificar prisma/schema.prisma con los cambios deseados

# 2. Generar y aplicar la migración (solo en desarrollo)
pnpm prisma:migrate
# → Crea un archivo SQL en prisma/migrations/ y lo aplica

# 3. Regenerar el cliente Prisma (si cambiaron modelos)
pnpm prisma:generate
```

> ⚠️ **Nunca correr `prisma migrate dev` en producción.** En producción siempre usar `pnpm prisma:migrate:deploy`, que aplica migraciones pendientes sin interactividad ni prompts.

### Comandos Prisma

| Script                       | Descripción                                         |
| ---------------------------- | --------------------------------------------------- |
| `pnpm prisma:generate`       | Regenera el cliente en `src/generated/`             |
| `pnpm prisma:migrate`        | Crea y aplica una nueva migración (dev)             |
| `pnpm prisma:migrate:deploy` | Aplica migraciones pendientes (producción)          |
| `pnpm prisma:studio`         | Abre Prisma Studio — GUI para explorar/editar datos |
| `pnpm prisma:seed`           | Corre `prisma/seed.js` para poblar datos de prueba  |

### Prisma Studio

```bash
pnpm prisma:studio
```

Disponible en `http://localhost:5555`. Útil durante desarrollo para inspeccionar registros sin necesidad de cliente SQL externo.

---

## 🚀 Instalación y desarrollo

### Prerrequisitos

- Node.js `>= 20.0.0`
- pnpm `>= 10.0.0`
- Docker + Docker Compose

### Setup inicial

```bash
cd server

# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
# → Editar .env con los valores correspondientes

# 3. Levantar PostgreSQL en Docker
pnpm docker:up

# 4. Correr migraciones y generar el cliente Prisma
pnpm prisma:migrate
pnpm prisma:generate

# 5. (Opcional) Poblar con datos de prueba
pnpm prisma:seed

# 6. Iniciar el servidor en modo desarrollo
pnpm dev
```

El servidor estará disponible en `http://localhost:5000`

### Scripts de desarrollo

| Script       | Descripción                                                |
| ------------ | ---------------------------------------------------------- |
| `pnpm dev`   | Inicia con `--watch` y `--env-file` (recarga ante cambios) |
| `pnpm start` | Inicia en modo producción (sin watch)                      |
| `pnpm test`  | Corre los tests con Node test runner nativo                |

---

## 📡 API Endpoints

Todos los endpoints con 🔒 requieren el header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Auth

| Método | Ruta                 | Descripción             |
| ------ | -------------------- | ----------------------- |
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login`    | Login — retorna JWT     |

### Tasks 🔒

| Método   | Ruta             | Descripción                         |
| -------- | ---------------- | ----------------------------------- |
| `GET`    | `/api/tasks`     | Listar todas las tareas del usuario |
| `POST`   | `/api/tasks`     | Crear nueva tarea                   |
| `GET`    | `/api/tasks/:id` | Obtener tarea específica            |
| `PUT`    | `/api/tasks/:id` | Actualizar tarea                    |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea                      |

### Query parameters para `GET /api/tasks`

| Parámetro  | Tipo                          | Descripción                        |
| ---------- | ----------------------------- | ---------------------------------- |
| `status`   | `todo \| in_progress \| done` | Filtrar por estado                 |
| `priority` | `low \| medium \| high`       | Filtrar por prioridad              |
| `search`   | `string`                      | Buscar en título y descripción     |
| `tags`     | `string`                      | Filtrar por tags (comma-separated) |

---

## 🗄️ Modelos de datos (PostgreSQL)

### User

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hash
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status   @default(todo)
  priority    Priority @default(medium)
  dueDate     DateTime?
  tags        String[]
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status   { todo in_progress done }
enum Priority { low medium high }
```

> **Nota sobre el esquema real:** el schema definitivo vive en `prisma/schema.prisma`. Los modelos arriba son representativos — ante cualquier discrepancia, el archivo `.prisma` es la fuente de verdad.

---

## 🧪 Testing

```bash
pnpm test
```

Los tests viven en `/tests/` y usan el runner nativo de Node.js junto con `supertest` para levantar el servidor en memoria y hacer requests HTTP reales.

```bash
# Correr un test específico
node --test ./tests/health.test.js
```

---

## 🐋 Deploy con Docker (producción)

El `Dockerfile` en la raíz del server define la imagen de producción.

```bash
# Build de la imagen
docker build -t taskflow-api .

# Correr el contenedor
docker run -p 5000:5000 --env-file .env taskflow-api
```

### Consideraciones de producción

1. **Migraciones antes de iniciar:** el entrypoint del contenedor debe correr `prisma migrate deploy` antes de `node server.js`.
2. **`DATABASE_URL` en producción** apunta a la instancia de PostgreSQL real (Supabase, Railway, RDS, etc.) — nunca al contenedor local.
3. **`NODE_ENV=production`** deshabilita stack traces en respuestas de error y activa optimizaciones de Express.
4. **Secrets:** `JWT_SECRET` debe ser una cadena aleatoria de al menos 32 caracteres. Usar un secret manager (Railway Variables, Render Env Vars, AWS Secrets Manager) en lugar de archivos `.env` en el servidor.

### Deploy recomendado (Railway / Render)

1. Conectar el repositorio
2. Configurar las variables de entorno del `.env.example`
3. Set build command: `pnpm install && pnpm prisma:generate && pnpm prisma:migrate:deploy`
4. Set start command: `pnpm start`
5. Deploy automático desde la branch `main`

---

## 🔗 Conexión con el frontend

Ver el [README del cliente](../client/README.md) para la configuración de `VITE_API_URL`.
