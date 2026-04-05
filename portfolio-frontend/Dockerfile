# ─────────────────────────────────────────────
# Stage 1: Build the Vite React app
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_URL must be passed at build time so the bundle knows where the backend is
# e.g. docker build --build-arg VITE_API_URL=https://api.yourdomain.com
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
# Output: /app/dist


# ─────────────────────────────────────────────
# Stage 2: Serve with Nginx
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
