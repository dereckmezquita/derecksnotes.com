ARG NODE_VERSION=20
FROM node:20-slim AS distribution

# Install sharp dependencies
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Install sharp globally
RUN yarn global add sharp

# Copy the rest of the client code
COPY client/ /app/client/

# Build the project
RUN yarn build

EXPOSE 3000

# used export standalone
CMD ["yarn", "run", "start"]
