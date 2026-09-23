# Build dependencies and application artifacts.
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src
COPY tsconfig.json ./

RUN npm ci
RUN npm run prisma:generate
RUN npm run build

# Keep only production dependencies and compiled output in the runtime image.
FROM node:18-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev \
  && npm run prisma:generate \
  && npm cache clean --force

RUN addgroup -S nodejs -g 1001 \
  && adduser -S nodejs -u 1001 -G nodejs \
  && chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 4000) + '/health', response => process.exit(response.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
