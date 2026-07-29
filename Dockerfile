# Explicit build, so nothing depends on the host guessing a Node version, a
# package manager, or which dependencies a production install should include.
#
# This exists because Railway's own builder mounts a cache directory inside
# /app/node_modules, and `npm ci` clears node_modules before installing — it
# cannot remove a mount point, so every build after the first died with
# EBUSY on /app/node_modules/.vite. A Docker layer has no such mount.

FROM node:22-alpine AS build
WORKDIR /app

# Copy manifests first so the dependency layer is cached independently of source
# changes — editing a lesson should not reinstall node_modules.
COPY package.json package-lock.json ./

# --include=dev is load-bearing. Railway sets NODE_ENV=production during builds
# (npm warns about it in the build log), which makes npm skip devDependencies,
# and typescript and vite both live there.
RUN npm ci --include=dev

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# The server uses only Node built-ins, so the runtime image carries no
# dependencies at all — no node_modules, no package.json. Smaller image, faster
# boot, and nothing in production to audit or patch.
COPY --from=build /app/dist ./dist
COPY server.mjs save-store.mjs ./

EXPOSE 8080

# Deliberately left as root. Running as the `node` user is tidier, but the
# progress volume is mounted at runtime and is typically root-owned, so an
# unprivileged process would fail to write save.json — trading a modest
# hardening win for a silent loss of every child's progress.

CMD ["node", "server.mjs"]
