# ========== BUILD STAGE ==========
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# ========== DEVELOPMENT STAGE ==========
FROM node:18-alpine AS development

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Development command (with hot reload)
CMD ["npm", "run", "dev"]

# ========== PRODUCTION STAGE ==========
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy necessary files
COPY src/db ./src/db

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Production command
CMD ["node", "dist/server.js"]