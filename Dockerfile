# syntax=docker/dockerfile:1
# Image prod NestJS + Prisma (SQLite) + Puppeteer — Coolify-ready.
# Persistance SQLite : volume sur /data et
#   DATABASE_URL=file:/data/db.sqlite

########## Build ##########
FROM node:22-bookworm-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Skip Chrome au build (telecharge uniquement dans l'image finale)
# NODE_ENV=development : force les devDependencies (nest, typescript, prisma)
# meme si Coolify injecte NODE_ENV=production au buildtime.
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV DATABASE_URL="file:./prisma/db.sqlite"
ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY prisma ./prisma
COPY prisma.config.ts nest-cli.json tsconfig.json tsconfig.base.json tsconfig.build.json ./
COPY src ./src

RUN npx prisma generate \
  && npx nest build \
  && mkdir -p dist/generated \
  && cp -r src/generated/prisma dist/generated/prisma

########## Runtime ##########
FROM node:22-bookworm-slim AS production

# Deps systeme Chromium (Puppeteer) + outils de compile natifs
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    wget \
    xdg-utils \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production \
    PORT=8585 \
    TRUST_PROXY=1 \
    PUPPETEER_CACHE_DIR=/app/.cache/puppeteer \
    DATABASE_URL="file:/data/db.sqlite"

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
  && npm install prisma@7.8.0 --no-save \
  && apt-get purge -y python3 make g++ \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/* /root/.npm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY prisma.config.ts ./
COPY docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh \
  && mkdir -p /data /app/.cache/puppeteer \
  && chown -R node:node /app /data

USER node

EXPOSE 8585
VOLUME ["/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||8585)+'/',(r)=>{r.resume();process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
