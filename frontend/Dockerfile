FROM node:22-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente del frontend
COPY . .

# Exponer el puerto solicitado por el usuario para el servidor de desarrollo Vite
EXPOSE 5175

# Comando para ejecutar el servidor de desarrollo exponiendo el host
# Se usa --port 5175 para forzar el puerto dentro del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5175"]
