FROM node:18-alpine AS build
WORKDIR /app/client
COPY client/package.json ./package.json
RUN npm install
COPY client/ ./
COPY tsconfig.base.json /app/tsconfig.base.json
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
