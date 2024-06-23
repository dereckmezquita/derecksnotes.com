FROM node:18-alpine as base

RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile && \
    yarn rebuild --arch=x64 --platform=linux --libc=musl sharp

# Copy the rest of the client code
COPY client/ /app/client/

# Build the project
RUN yarn build

EXPOSE 3000

# used export standalone
CMD ["yarn", "run", "start"]
