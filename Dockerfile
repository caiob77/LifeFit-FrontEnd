# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine

# ---- base -------------------------------------------------------------
# Common base for all stages: pnpm via corepack, libc6-compat for
# native deps (sharp, etc) that Next.js may need on Alpine.
FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@11.21.0 --activate
WORKDIR /app

# ---- deps ---------------------------------------------------------------
# Install dependencies in their own layer so they're only reinstalled
# when the lockfile/manifest actually change.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- builder --------------------------------------------------------------
# Build-time NEXT_PUBLIC_* vars get baked into the client bundle, so they
# must be provided as build args.
FROM base AS builder
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL} \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- runner ---------------------------------------------------------------
# Minimal runtime image: only the standalone server output, static assets
# and public files — no node_modules, no source, no package manager.
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
