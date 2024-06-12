# Base image for Node
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as base

# ARG for Bun version
ARG BUN_VERSION=1.0.34

# Set working directory
WORKDIR /app

# Install Bun
RUN npm install -g bun@${BUN_VERSION}

# Copy project files
COPY . .

# Build the client
FROM base as client-build
WORKDIR /app/client
RUN bun install
RUN bun run build

# Build the server
FROM base as server-build
WORKDIR /app/server
RUN bun install

# Production image
FROM node:${NODE_VERSION}-slim as production
ARG BUN_VERSION=1.0.34

# Set working directory
WORKDIR /app

# Install Bun
RUN npm install -g bun@${BUN_VERSION}

# Copy the client build output
COPY --from=client-build /app/client/.next /app/client/.next
COPY --from=client-build /app/client/public /app/client/public

# Copy the server code
COPY --from=server-build /app/server /app/server

# Copy necessary files
COPY package.json yarn.lock /app/

# Install dependencies
RUN bun install

# Set working directory for server
WORKDIR /app/server

# Expose port (adjust according to your server's port)
EXPOSE 3000

# Start the server
CMD ["bun", "run", "start"]
