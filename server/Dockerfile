FROM node:18-alpine AS builder
WORKDIR /app/server
COPY server/package.json ./package.json
RUN npm install
COPY server/ ./
COPY tsconfig.base.json /app/tsconfig.base.json
RUN npm run build

FROM node:18-alpine
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package.json ./package.json
RUN npm install --omit=dev
COPY --from=builder /app/server/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
