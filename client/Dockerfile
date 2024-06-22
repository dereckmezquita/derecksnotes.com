ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine as builder

# Set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the client code
COPY client/ /app/client/

# Build the project
RUN yarn build

FROM node:18-alpine as runner

WORKDIR /app/client/

COPY --from=builder /app/client/.env /app/client/.env
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/client/package.json /app/client/package.json
COPY --from=builder /app/client/yarn.lock /app/client/yarn.lock
COPY --from=builder /app/client/next.config.mjs /app/client/next.config.mjs

COPY --from=builder /app/client/.next/ /app/client/.next/

# https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files
# public folder attached as a volume at /app/client/public
COPY --from=builder /app/client/public /app/client/.next/standalone/public
COPY --from=builder /app/client/.next/static /app/client/.next/standalone/.next/static

EXPOSE 3000

# used export standalone
CMD ["node", ".next/standalone/server.js"]
