# Estágio 1: Build da aplicação com Node.js
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copia todo o resto do código-fonte
COPY . .

# Executa o script de build do React (Vite)
RUN npm run build


# Estágio 2: Servir os arquivos com Nginx
FROM nginx:stable-alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa configuração personalizada do Nginx para o contêiner.
# Este arquivo contém a lógica para lidar com as rotas do React.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos construídos (da pasta 'dist') do estágio anterior para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
