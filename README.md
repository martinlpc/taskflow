# TaskFlow

> Gestor de tareas moderno y minimalista para freelancers. Full-stack monorepo con React 19 + Node.js 20 + PostgreSQL.

[![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)](https://github.com/martinlpc/taskflow)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev)
[![Node](https://img.shields.io/badge/Node-20+-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://prisma.io)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

---

## 📋 Descripción

TaskFlow permite a freelancers gestionar sus tareas diarias con una interfaz limpia e intuitiva. Soporta estados, prioridades, etiquetas, búsqueda de texto y vista de calendario.

Esta branch (`feature/migrate-db-to-postgres`) representa la **migración de MongoDB/Mongoose a PostgreSQL + Prisma ORM**, introduciendo además containerización con Docker y un esquema de datos relacional con integridad referencial.

---

## ✨ Features

### MVP (v2.0)

- ✅ Autenticación completa (registro y login con JWT)
- ✅ CRUD completo de tareas
- ✅ Estados: `To Do`, `In Progress`, `Done`
- ✅ Prioridades: `Low`, `Medium`, `High`
- ✅ Búsqueda por texto y filtros por estado/prioridad/tags
- ✅ Tags personalizables
- ✅ Vista de calendario
- ✅ Diseño responsive

### En desarrollo 🚧

- 🔄 Modal de detalle/edición de tarea (`TaskDetailModal`)
- 🔄 Estado global con Context API
- 🔄 Dashboard con métricas visuales
- 🔄 Estimación y tracking de tiempo
- 🔄 Múltiples proyectos/workspaces
- 🔄 Modo oscuro

---

## 🛠️ Tech Stack

### Frontend (`/client`)

| Tecnología         | Versión |
| ------------------ | ------- |
| React              | 19.1.1  |
| Vite               | 7.1.7   |
| React Router       | 7.9.4   |
| Tailwind CSS       | 4.1.17  |
| Axios              | 1.12.2  |
| react-big-calendar | 1.19.4  |

### Backend (`/server`)

| Tecnología       | Versión  |
| ---------------- | -------- |
| Node.js          | ≥ 20.0.0 |
| Express          | 5.1.0    |
| PostgreSQL       | 16+      |
| Prisma ORM       | 5.22.0   |
| JWT              | 9.0.2    |
| bcryptjs         | 3.0.2    |
| Docker + Compose | —        |

---

## 📁 Estructura del monorepo

```
taskflow/
├── client/                     # Frontend React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables de UI
│   │   ├── context/            # 🚧 Estado global (React Context API)
│   │   ├── pages/              # Vistas + route guards
│   │   ├── services/           # Capa de comunicación con la API
│   │   └── utils/              # Helpers y constantes
│   └── README.md               # Documentación del cliente
│
├── server/                     # Backend Node.js + Express
│   ├── prisma/                 # Schema, migraciones y seed
│   ├── src/
│   │   ├── config/             # Configuración global
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── middleware/         # Auth JWT y manejo de errores
│   │   └── routes/             # Rutas Express
│   ├── tests/                  # Tests con Node test runner nativo
│   ├── docker-compose.yml      # PostgreSQL en contenedor
│   ├── Dockerfile              # Imagen de producción
│   └── README.md               # Documentación del servidor
│
├── package.json                # Scripts del monorepo (raíz)
├── LICENSE
└── README.md
```

---

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js `>= 20.0.0`
- pnpm `>= 10.0.0`
- Docker + Docker Compose

### 1. Clonar el repositorio

```bash
git clone https://github.com/martinlpc/taskflow.git
cd taskflow
git checkout feature/migrate-db-to-postgres
```

### 2. Configurar variables de entorno

```bash
# Backend
cp server/.env.example server/.env
# → Editar server/.env con los valores correspondientes

# Frontend
cp client/.env.example client/.env  # o crear manualmente
# → Agregar VITE_API_URL=http://localhost:5000/api
```

### 3. Instalar dependencias

```bash
pnpm install:client
pnpm install:server
```

### 4. Levantar la base de datos

```bash
cd server
pnpm docker:up
```

### 5. Inicializar la base de datos

```bash
cd server
pnpm prisma:migrate     # Aplica migraciones
pnpm prisma:generate    # Genera el cliente Prisma
pnpm prisma:seed        # (Opcional) Datos de prueba
```

### 6. Iniciar en desarrollo

Desde la raíz del monorepo, para levantar cliente y servidor simultáneamente:

```bash
pnpm dev
```

O por separado:

```bash
pnpm dev:server   # http://localhost:5000
pnpm dev:client   # http://localhost:5173
```

---

## 📡 API — Endpoints principales

| Método   | Ruta                 | Auth | Descripción               |
| -------- | -------------------- | ---- | ------------------------- |
| `POST`   | `/api/auth/register` | —    | Registrar usuario         |
| `POST`   | `/api/auth/login`    | —    | Login → retorna JWT       |
| `GET`    | `/api/tasks`         | 🔒   | Listar tareas del usuario |
| `POST`   | `/api/tasks`         | 🔒   | Crear tarea               |
| `GET`    | `/api/tasks/:id`     | 🔒   | Obtener tarea             |
| `PUT`    | `/api/tasks/:id`     | 🔒   | Actualizar tarea          |
| `DELETE` | `/api/tasks/:id`     | 🔒   | Eliminar tarea            |

Ver documentación completa en el [README del servidor](./server/README.md).

---

## 🗄️ Migración MongoDB → PostgreSQL

Esta branch introduce un cambio fundamental en la capa de persistencia. Las razones principales:

- **Integridad referencial:** la relación `User → Task` se garantiza a nivel de base de datos con foreign keys, no solo a nivel de aplicación.
- **Schema explícito:** Prisma obliga a definir el modelo de datos de antemano, lo que reduce inconsistencias y errores en runtime.
- **Migraciones versionadas:** cada cambio al schema queda registrado como un archivo SQL en `server/prisma/migrations/`, facilitando el tracking de cambios y los rollbacks.
- **Enums nativos:** los valores de `status` y `priority` son enums en la DB, no strings libres.

> Ver el historial de cambios en `server/prisma/migrations/` y el schema completo en `server/prisma/schema.prisma`.

---

## 🧪 Testing

```bash
# Tests del servidor (Node test runner nativo)
cd server
pnpm test
```

---

## 📦 Deploy

| Capa          | Plataforma recomendada   | Notas                                                 |
| ------------- | ------------------------ | ----------------------------------------------------- |
| Frontend      | Vercel / Netlify         | Build: `pnpm build`, Output: `dist`                   |
| Backend       | Railway / Render         | Start: `pnpm start`, requiere `prisma migrate deploy` |
| Base de datos | Supabase / Railway / RDS | Connection string vía `DATABASE_URL`                  |

Ver instrucciones detalladas en los READMEs de cada subcarpeta:

- [Cliente → README](./client/README.md)
- [Servidor → README](./server/README.md)

---

## 🤝 Contribuciones

Proyecto personal de portfolio. Sugerencias bienvenidas vía Issues o Pull Requests.

1. Fork del proyecto
2. Crear branch: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'feat: descripción del cambio'`
4. Push: `git push origin feature/mi-feature`
5. Abrir Pull Request hacia `main`

---

## 👤 Autor

**Martín Pacheco**

- GitHub: [@martinlpc](https://github.com/martinlpc)
- LinkedIn: [martinlpacheco](https://linkedin.com/in/martinlpacheco)

---

## 📝 Licencia

MIT — ver [LICENSE](./LICENSE) para más detalles.
