# Folosește o versiune de Node.js compatibilă
FROM node:20-alpine AS build

# Setează directorul de lucru
WORKDIR /app

# Copiază fișierele necesare pentru instalarea dependințelor
COPY package*.json ./

# Instalează dependințele
RUN npm install

# Copiază restul aplicației
COPY . .

# Construiește aplicația Angular pentru producție
RUN npm run build -- --configuration production

# Faza Nginx
FROM nginx:alpine

# Copiază fișierele build-ului Angular în Nginx
COPY --from=build /app/dist/poarta-frontend//browser  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


CMD ["nginx", "-g", "daemon off;"]
