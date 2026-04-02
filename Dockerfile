# Build stage for client
FROM oven/bun:1.1 AS client-builder
WORKDIR /app

# Copy workspace config and all package.json files
COPY package.json bun.lock* ./
COPY client/package.json client/
COPY server/package.json server/
COPY shared/package.json shared/

# Install all workspace dependencies
RUN bun install --frozen-lockfile

# Copy shared package source
COPY shared/ shared/

# Copy client source
COPY client/ client/
RUN rm -rf client/.next

# Build arguments
ARG BUILD_ENV=prod
ARG COMMIT_SHA=local

ENV BUILD_ENV=${BUILD_ENV}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

WORKDIR /app/client
RUN bun run build

# Build stage for server
FROM oven/bun:1.1 AS server-builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY client/package.json client/
COPY server/package.json server/
COPY shared/package.json shared/

RUN bun install --frozen-lockfile

COPY shared/ shared/
COPY server/ server/

# Production image
FROM oven/bun:1.1-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends tini curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root package.json for version reading
COPY --from=client-builder /app/package.json ./package.json

# Copy built client
COPY --from=client-builder /app/client ./client
COPY --from=client-builder /app/node_modules ./node_modules

# Copy server
COPY --from=server-builder /app/server ./server
COPY --from=server-builder /app/node_modules ./node_modules

# Copy shared
COPY --from=client-builder /app/shared ./shared

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Copy drizzle migrations
COPY --from=server-builder /app/server/drizzle ./server/drizzle

EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["/app/entrypoint.sh"]
