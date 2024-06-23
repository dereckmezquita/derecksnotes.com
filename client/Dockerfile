ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS distribution

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile && \
    yarn add sharp && \
    npm rebuild --arch=x64 --platform=linux --libc=musl sharp

# Copy the rest of the client code
COPY client/ /app/client/

# Build the project
RUN yarn build

EXPOSE 3000

# used export standalone
CMD ["yarn", "run", "start"]
