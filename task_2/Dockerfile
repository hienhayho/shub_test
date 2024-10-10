FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci



FROM node:20-alpine as production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

CMD ["npm", "run", "start"]