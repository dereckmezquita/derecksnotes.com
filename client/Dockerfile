FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/package-lock.json ./

COPY client/.env /app/client/.env

# https://stackoverflow.com/questions/71426665/how-run-next-js-with-node-sharp-for-docker#answer-77150832
# Install dependencies
RUN npm install --frozen-lockfile && \
    npm rebuild --arch=x64 --platform=linux --libc=musl sharp

# Copy the rest of the client code
COPY client/ /app/client/

# Build the project
RUN npm run build

EXPOSE 3000

# used export standalone
CMD ["npm", "run", "start"]
