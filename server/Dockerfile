# https://andrekoenig.de/articles/using-bun-as-the-package-manager-in-production-ready-docker-images
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS distribution
ARG BUN_VERSION=1.0.34

RUN npm install -g bun@${BUN_VERSION}

WORKDIR /app/
COPY package.json /app/

WORKDIR /app/server/
COPY server/package.json server/yarn.lock ./

COPY server/.env /app/client/.env

RUN yarn install --frozen-lockfile

COPY server/ /app/server/

USER node

# RUN yarn run test

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]