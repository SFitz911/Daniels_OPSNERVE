FROM node:18-alpine AS base
WORKDIR /app

# Copy server and client files
COPY server/package*.json ./server/
COPY server/server.js ./server/
COPY client ./client

WORKDIR /app/server
RUN npm install --production

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "server.js"]
