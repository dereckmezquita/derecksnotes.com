# https://andrekoenig.de/articles/using-bun-as-the-package-manager-in-production-ready-docker-images
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as distribution
ARG BUN_VERSION=1.0.34

WORKDIR /app/server
RUN npm install -g bun@${BUN_VERSION}

COPY ../package.json /app/package.json
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

USER node

# RUN yarn run test

EXPOSE 3001

ENTRYPOINT ["bun", "run", "start"]