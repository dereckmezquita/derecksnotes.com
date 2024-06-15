# https://andrekoenig.de/articles/using-bun-as-the-package-manager-in-production-ready-docker-images
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as distribution

# Set the working directory
WORKDIR /app/client

COPY ../package.json /app/package.json
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "run", "start"]