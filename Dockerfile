# Dockerfile

# syntax=docker/dockerfile:1

# ============================================
# Stage 1: Base - Production Dependencies
# ============================================
FROM node:20-alpine AS base

# Metadata labels
LABEL maintainer="fixspotify"
LABEL org.opencontainers.image.title="FixSpotify"
LABEL org.opencontainers.image.description="Better Spotify embeds for social platforms"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="fixspotify"
LABEL org.opencontainers.image.licenses="ISC"
LABEL org.opencontainers.image.source="https://github.com/gurrrrrrett3/fixspotify"

WORKDIR /app

# Install production dependencies with BuildKit cache mount
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# ============================================
# Stage 2: Builder - Build Application
# ============================================
FROM node:20-alpine AS builder

LABEL stage=builder
LABEL org.opencontainers.image.title="FixSpotify Builder"
LABEL org.opencontainers.image.description="Build stage for FixSpotify application"

WORKDIR /app

# Copy package files and install ALL dependencies (including dev) with cache mount
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# Copy source code and configuration
COPY tsconfig.json vite.config.ts ./
COPY src ./src
COPY client ./client

# Build both client and server
RUN npm run build

# ============================================
# Stage 3: Production - Final Image
# ============================================
FROM node:20-alpine AS production

LABEL stage=production
LABEL org.opencontainers.image.title="FixSpotify Production"
LABEL org.opencontainers.image.description="Production-ready FixSpotify application"
LABEL org.opencontainers.image.version="1.0.0"

WORKDIR /app

# Copy production node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy package.json for npm start
COPY package*.json ./

# Copy build artifacts from builder
COPY --from=builder /app/dist ./dist

# Copy runtime-required directories (templates loaded at runtime, not compiled)
COPY src/templates ./src/templates
COPY client/assets ./client/assets

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check using /healthz endpoint
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["npm", "start"]

# ============================================
# Stage 4: Development - Hot Reload
# ============================================
FROM node:20-alpine AS development

LABEL stage=development
LABEL org.opencontainers.image.title="FixSpotify Development"
LABEL org.opencontainers.image.description="Development environment with hot reload for FixSpotify"

WORKDIR /app

# Install all dependencies with BuildKit cache mount
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy configuration files
COPY tsconfig.json vite.config.ts ./

# Environment
ENV NODE_ENV=development
ENV PORT=3000

# Expose both Express server and Vite dev server ports
EXPOSE 3000 5173

# Run full dev workflow: Vite watch, TypeScript watch, and nodemon
CMD ["npm", "run", "dev"]
