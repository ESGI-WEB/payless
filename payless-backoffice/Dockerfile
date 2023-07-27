# Utilisez une image Node.js pour construire l'application
FROM node:19.6 as build-stage
# Définissez le répertoire de travail dans l'image
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application dans l'image
COPY . .

# Construisez l'application avec Vite
RUN npm run build

# Utilisez une image Nginx pour servir l'application construite
FROM nginx:alpine as production-stage

# Copiez les fichiers construits depuis l'étape de construction vers le répertoire de l'application Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposez le port 80 pour HTTPS
EXPOSE 80

# Démarrez Nginx pour servir l'application en utilisant HTTP
CMD ["nginx", "-g", "daemon off;"]