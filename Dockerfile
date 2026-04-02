# Build stage for client
FROM oven/bun:1.1 AS client-builder
WORKDIR /app/client
COPY client/package.json client/bun.lock* ./
RUN bun install --frozen-lockfile

COPY client/ ./
# Clean any stale build artefacts
RUN rm -rf .next

# Copy root package.json (client env.ts reads version from it)
COPY package.json /app/package.json

# Copy shared package (workspace dependency)
COPY shared/ /app/shared/

# Build arguments
ARG BUILD_ENV=prod
ARG COMMIT_SHA=local

# Make available to Next.js build (NEXT_PUBLIC_ prefix exposes to browser)
ENV BUILD_ENV=${BUILD_ENV}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

RUN bun run build

# Build stage for server
FROM oven/bun:1.1 AS server-builder
WORKDIR /app/server
COPY server/package.json server/bun.lock* ./
RUN bun install --frozen-lockfile

COPY server/ ./
# Copy shared package
COPY shared/ /app/shared/

# Production image
FROM oven/bun:1.1-slim AS production

# Install tini for proper PID 1 init and curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends tini curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the full client (includes .next build output, src, and node_modules)
COPY --from=client-builder /app/client ./client

# Copy Express server
COPY --from=server-builder /app/server ./server

# Copy shared package
COPY --from=client-builder /app/shared ./shared

# Copy root package.json
COPY --from=client-builder /app/package.json ./package.json

# Install production deps for server
WORKDIR /app/server
RUN bun install --production

WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["/app/entrypoint.sh"]
