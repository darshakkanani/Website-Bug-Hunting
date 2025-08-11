# Multi-stage build for frontend and backend
FROM node:18-alpine as base

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci

# Build frontend
FROM base as frontend-build
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm run build

# Build backend
FROM base as backend-build
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Install production dependencies for backend
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package*.json ./backend/

# Copy backend source
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./backend/public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Start the application
WORKDIR /app/backend
CMD ["npm", "start"]