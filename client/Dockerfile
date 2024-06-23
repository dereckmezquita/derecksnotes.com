ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-bullseye-slim AS base

# install sharp dependencies for image optimisation
RUN yarn add -g --arch=x64 --platform=linux --libc=glibc sharp@0.33.0-rc.2

# Install build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

# Install sharp globally
RUN npm install -g sharp

# Set environment variable for sharp
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

# Set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

RUN yarn global add sharp

# Copy the rest of the client code
COPY client/ /app/client/

# Build the project
RUN yarn build

EXPOSE 3000

# used export standalone
CMD ["yarn", "run", "start"]
