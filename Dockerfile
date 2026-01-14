# Build stage for client
FROM oven/bun:1 AS client-builder
WORKDIR /app/client
COPY client/package.json client/bun.lock* ./
RUN bun install --frozen-lockfile
COPY client/ ./
# Clean any stale build artifacts
RUN rm -rf .next

COPY package.json /app/package.json

# Build arguments
ARG BUILD_ENV=prod
ARG COMMIT_SHA=local

# Make available to Next.js build (NEXT_PUBLIC_ prefix exposes to browser)
ENV BUILD_ENV=${BUILD_ENV}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

RUN bun run build

# Build stage for server
FROM oven/bun:1 AS server-builder
WORKDIR /app/server
COPY server/package.json server/bun.lock* ./
RUN bun install --frozen-lockfile
COPY server/ ./

# Production image
FROM oven/bun:1-slim AS production
WORKDIR /app

# Copy the full client (includes .next build output, src, and node_modules)
COPY --from=client-builder /app/client ./client

# Copy Express server
COPY --from=server-builder /app/server ./server

# Install production deps for server
WORKDIR /app/server
RUN bun install --production

WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3000 3001

# Run both processes
CMD ["sh", "-c", "cd /app/client && bun run start & cd /app/server && bun src/index.ts"]
