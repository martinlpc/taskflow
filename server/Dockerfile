# ============================================
# Stage 1: Builder
# ============================================
FROM node:22-alpine AS builder

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Generar Prisma Client
RUN npx prisma generate

# ============================================
# Stage 2: Production
# ============================================
FROM node:22-alpine

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar node_modules y prisma desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copiar el código de la aplicación
COPY package*.json ./
COPY server.js ./
COPY src ./src

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Exponer el puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["npm", "start"]