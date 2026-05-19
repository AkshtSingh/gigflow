FROM node:20-alpine AS builder
WORKDIR /app/server
COPY server/package.json ./package.json
RUN npm install --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-timeout=300000
COPY server/ ./
COPY tsconfig.base.json /app/tsconfig.base.json
RUN npm run build

FROM node:20-alpine
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package.json ./package.json
RUN npm install --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-timeout=300000
COPY --from=builder /app/server/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
