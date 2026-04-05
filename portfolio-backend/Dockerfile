FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server.ts tsconfig.json ./

EXPOSE 4000

CMD ["node", "--import", "tsx/esm", "server.ts"]