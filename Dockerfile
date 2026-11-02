# syntax=docker/dockerfile:1

# ---- deps: prod-only node_modules, cached on lockfile ----
FROM node:26-alpine AS deps
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts

# ---- runtime: no npm install step, non-root ----
FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /usr/app
COPY --from=deps --chown=node:node /usr/app/node_modules ./node_modules
COPY --chown=node:node package.json index.js ./
USER node
EXPOSE 8080
CMD ["node", "index.js"]
