# TaskFlow — Client

> Frontend de TaskFlow: interfaz moderna y minimalista para gestión de tareas, construida con React 19 + Vite 7 y Tailwind CSS 4.

---

## 🛠️ Tech Stack

| Tecnología             | Versión | Rol                                                     |
| ---------------------- | ------- | ------------------------------------------------------- |
| **React**              | 19.1.1  | UI framework                                            |
| **Vite**               | 7.1.7   | Build tool & dev server                                 |
| **React Router**       | 7.9.4   | Client-side routing + route guards                      |
| **Axios**              | 1.12.2  | HTTP client                                             |
| **Tailwind CSS**       | 4.1.17  | Utility-first styling                                   |
| **react-big-calendar** | 1.19.4  | Vista de calendario                                     |
| **moment**             | 2.30.1  | Manipulación de fechas (peer dep de react-big-calendar) |

### ¿Por qué estas elecciones?

**React 19** trae mejoras en el compilador automático: reduce la necesidad de `useMemo`/`useCallback` manuales porque el compilador los infiere. Usar la versión más reciente permite aprovechar estas optimizaciones sin cambios en el código existente.

**Vite 7** sobre Create React App o Webpack porque el tiempo de arranque en dev es prácticamente instantáneo gracias a ESM nativo. El HMR es mucho más rápido, lo que mejora la experiencia de desarrollo día a día.

**Tailwind CSS v4** introduce un nuevo motor basado en Rust (Lightning CSS), eliminando la necesidad de `postcss` como paso intermedio obligatorio. La integración vía `@tailwindcss/vite` es directa y no requiere configuración de purge manual.

**React Router v7** en modo SPA clásico, con la arquitectura de `PrivateRoute`/`PublicRoute` para proteger rutas según el estado de sesión.

**Axios** sobre `fetch` nativo porque simplifica la configuración de interceptores de request/response — útil para adjuntar el JWT en cada request autenticado y manejar errores 401 de forma global sin repetir lógica en cada llamada.

**react-big-calendar** requiere `moment` como peer dependency. Es un trade-off conocido: `moment` agrega ~300KB al bundle, pero es la opción más madura para calendarios complejos en React.

> ⚠️ **Deuda técnica:** considerar migrar de `moment` a `date-fns` o `luxon` como localizer de react-big-calendar para reducir el bundle size considerablemente.

---

## 📁 Estructura de carpetas

```
client/
├── public/
│   ├── tf_512x512.png          # Logo/favicon de la app
│   └── vite.svg
├── src/
│   ├── components/             # Componentes reutilizables de UI
│   │   ├── Calendar.jsx        # Vista de calendario (react-big-calendar)
│   │   ├── Modal.jsx           # Modal genérico reutilizable
│   │   ├── Navbar.jsx          # Barra de navegación principal
│   │   ├── TaskCard.jsx        # Tarjeta de tarea en la lista
│   │   └── TaskDetailModal.jsx # 🚧 En desarrollo
│   ├── context/                # 🚧 En desarrollo — Estado global (React Context API)
│   ├── pages/                  # Vistas principales (ensambladores de componentes)
│   │   ├── Home.jsx            # Landing / página principal
│   │   ├── Login.jsx           # Formulario de login
│   │   ├── Register.jsx        # Formulario de registro
│   │   ├── Tasks.jsx           # Vista principal de gestión de tareas
│   │   ├── PrivateRoute.jsx    # Guard: redirige a /login si no hay sesión
│   │   └── PublicRoute.jsx     # Guard: redirige a /tasks si ya hay sesión
│   ├── services/               # Capa de comunicación con la API
│   │   ├── authService.js      # Llamadas de registro, login, logout
│   │   └── taskService.js      # CRUD completo de tareas + filtros
│   ├── utils/                  # Helpers, formateadores, constantes
│   ├── App.jsx                 # Router principal con definición de rutas
│   ├── index.css               # Estilos globales + directivas de Tailwind
│   └── main.jsx                # Entry point — monta React en el DOM
├── .env                        # Variables de entorno locales (no commitear)
├── .gitignore
├── eslint.config.js            # ESLint 9 flat config
├── index.html                  # HTML raíz — Vite lo usa como plantilla
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🏗️ Decisiones de arquitectura

### Route Guards: `PrivateRoute` y `PublicRoute`

El sistema de rutas implementa dos guards que encapsulan la lógica de acceso:

- **`PrivateRoute`** protege rutas que requieren autenticación (ej: `/tasks`). Si el usuario no tiene sesión activa, redirige automáticamente a `/login`.
- **`PublicRoute`** protege rutas de acceso público (ej: `/login`, `/register`). Si el usuario _ya_ tiene sesión iniciada, redirige a `/tasks` para evitar una experiencia inconsistente.

```
App.jsx (Router)
├── /           → Home.jsx
├── /login      → PublicRoute  → Login.jsx
├── /register   → PublicRoute  → Register.jsx
└── /tasks      → PrivateRoute → Tasks.jsx
```

### Separación de servicios

En lugar de un único `apiService.js`, se separaron las responsabilidades en dos módulos:

- **`authService.js`** maneja registro, login y logout. Es el único lugar donde se escribe o elimina el JWT.
- **`taskService.js`** maneja todo el CRUD de tareas. Asume que el token ya existe y lo adjunta en cada request. Incluye los filtros por status, priority, search y tags.

Esta separación facilita el mantenimiento: si cambia el mecanismo de auth (ej: pasar de localStorage a httpOnly cookies), solo se modifica `authService.js` sin tocar la lógica de tareas.

### `pages/` vs `components/`

Las páginas son ensambladores — orquestan componentes y servicios pero no contienen lógica de UI propia. Los componentes en `/components/` son independientes del contexto de negocio y pueden reutilizarse en distintas páginas.

### Estado global — `context/` 🚧

La carpeta `context/` está reservada para la implementación de estado global con React Context API. Actualmente en desarrollo. Se planea centralizar aquí el estado de sesión del usuario y la lista de tareas, evitando prop drilling entre componentes.

> Cuando se implemente: si el scope crece hacia múltiples workspaces o colaboración en tiempo real, el paso natural sería migrar a **Zustand** o incorporar **React Query** para gestionar el estado del servidor.

---

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz de `/client`:

```env
VITE_API_URL=http://localhost:5000/api
```

> Las variables en Vite **deben** tener el prefijo `VITE_` para ser expuestas al bundle del cliente. Sin ese prefijo, Vite las ignora por seguridad.

---

## 🚀 Instalación y desarrollo

### Prerrequisitos

- Node.js `>= 20.0.0`
- pnpm `>= 10.0.0`

### Setup

```bash
# Desde la raíz del monorepo
cd client

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La app estará disponible en `http://localhost:5173`

### Scripts disponibles

| Script         | Descripción                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo con HMR           |
| `pnpm build`   | Bundle de producción en `/dist`          |
| `pnpm preview` | Sirve el bundle de producción localmente |
| `pnpm lint`    | ESLint sobre todo el código fuente       |

---

## 🏗️ Build de producción

```bash
pnpm build
```

El output se genera en `/client/dist`. Este directorio es el que se despliega en Vercel, Netlify o cualquier CDN estático.

### Deploy en Vercel (recomendado)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar:
    - **Framework Preset:** Vite
    - **Root Directory:** `client`
    - **Build Command:** `pnpm build`
    - **Output Directory:** `dist`
3. Agregar variable de entorno: `VITE_API_URL=https://tu-api.com/api`

> ⚠️ `VITE_API_URL` debe apuntar al backend ya deployado. Si cambia el dominio del servidor, actualizar esta variable y hacer un redeploy del frontend.

---

## 🔍 Linting

El proyecto usa **ESLint 9** con flat config (`eslint.config.js`), que reemplaza al `.eslintrc` clásico. Incluye:

- `eslint-plugin-react-hooks` — detecta uso incorrecto de hooks (dependencias faltantes en `useEffect`, etc.)
- `eslint-plugin-react-refresh` — garantiza compatibilidad con el HMR de Vite

```bash
pnpm lint
```

---

## 🔗 Conexión con el backend

El cliente se comunica con la API REST a través de Axios. El `baseURL` se configura desde `VITE_API_URL`.

Los endpoints protegidos esperan el header:

```
Authorization: Bearer <JWT_TOKEN>
```

El token se obtiene al hacer login/register a través de `authService.js` y es gestionado de forma centralizada — ningún componente interactúa con el token directamente.

Ver la documentación completa de endpoints en el [README del servidor](../server/README.md).
