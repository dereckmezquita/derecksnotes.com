FROM node:20.10-bullseye-slim AS base

FROM base AS builder

# set the working directory
WORKDIR /app/
COPY package.json /app/

WORKDIR /app/client/
COPY client/package.json client/yarn.lock ./

# install sharp dependencies for image optimisation
RUN yarn add -g --arch=x64 --platform=linux --libc=glibc sharp@0.33.0-rc.2

# install dependencies
RUN yarn install --frozen-lockfile

# copy the rest of the client code
COPY client/ /app/client/

# build the project; includes sharp in package.json
RUN yarn build

# https://flinect.com/blog/nextjs-standalone-docker-sharp-installation
FROM base AS runner

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV production

# path to global installation of sharp
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

# copy dependencies
COPY --from=builder --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp

WORKDIR /app/client/

# set the correct permission for prerender cache
RUN mkdir .next && \
    chown nextjs:nodejs .next &&

COPY --from=builder --chown=nextjs:nodejs /app/client/.env /app/client/.env
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nextjs:nodejs /app/client/package.json /app/client/package.json
COPY --from=builder --chown=nextjs:nodejs /app/client/yarn.lock /app/client/yarn.lock
COPY --from=builder --chown=nextjs:nodejs /app/client/next.config.mjs /app/client/next.config.mjs

# the build files
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/ /app/client/.next/

# https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files
# public folder attached as a volume at /app/client/public; cleanup before to allow copying of all files
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/static /app/client/.next/standalone/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/client/public /app/client/.next/standalone/public

RUN ls -la /app/client/.next/standalone/public

USER nextjs
EXPOSE 3000

# used export standalone
CMD ["node", ".next/standalone/server.js"]
