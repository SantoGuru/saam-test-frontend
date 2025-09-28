# Estágio 1: Build da aplicação com Node.js
# Usamos uma imagem do Node.js para instalar as dependências e construir os arquivos estáticos do React.
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o resto do código-fonte
COPY . .

# Executa o script de build do React (Vite)
RUN npm run build


# Estágio 2: Servir os arquivos com Nginx
# Usamos uma imagem super leve do Nginx para servir os arquivos estáticos gerados no estágio anterior.
FROM nginx:stable-alpine

# Copia os arquivos construídos (da pasta 'dist') do estágio anterior para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]