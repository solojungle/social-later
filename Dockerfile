FROM node:lts-alpine-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["sh", "-c", "npm run db:deploy && npm run dev"]
