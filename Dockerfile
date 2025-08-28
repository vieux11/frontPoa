# ===== Stage 1: Build Angular =====
FROM node:20-alpine AS build
WORKDIR /app

# Installe les deps
COPY package*.json ./
RUN npm ci

# Copie le code et build en mode prod
COPY . .
# Angular CLI est en devDependency -> npm ci suffit
RUN npm run build -- --configuration production

# Rassemble le build final (gère dist/<nom>/[browser]/)
RUN mkdir -p /app/build_out \
 && dist_dir="$(find /app/dist -name index.html -print -quit | xargs -I {} dirname {})" \
 && cp -r "$dist_dir"/* /app/build_out

# ===== Stage 2: Nginx (serveur statique) =====
FROM nginx:1.27-alpine
# Nettoie le html par défaut
RUN rm -rf /usr/share/nginx/html/*

# SPA config (fallback sur /index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie le build Angular
COPY --from=build /app/build_out/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
