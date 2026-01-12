# Build stage for client
FROM oven/bun:1 AS client-builder
WORKDIR /app/client
COPY client/package.json client/bun.lock* ./
RUN bun install --frozen-lockfile
COPY client/ ./

COPY package.json /app/package.json
ARG BUILD_ENV=prod
ENV BUILD_ENV=${BUILD_ENV}
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

# Copy Next.js standalone
COPY --from=client-builder /app/client/.next/standalone ./client
COPY --from=client-builder /app/client/.next/static ./client/.next/static
COPY --from=client-builder /app/client/public ./client/public

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
CMD ["sh", "-c", "cd /app/client && node server.js & cd /app/server && bun src/index.ts"]
