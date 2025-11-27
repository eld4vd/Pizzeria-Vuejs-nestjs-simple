# ============================================
# Dockerfile Backend - Pizzeria Mana API
# Multi-stage build para optimizar tamaño
# ============================================

# Etapa 1: Build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copiar solo los archivos necesarios para las dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# Etapa 2: Producción (más liviana)
FROM node:22-alpine
WORKDIR /usr/src/app

# Copiar solo lo necesario
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el resultado del build
COPY --from=build /usr/src/app/dist ./dist

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

USER nodejs

# Configuración del servidor
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

CMD ["node", "dist/main.js"]
