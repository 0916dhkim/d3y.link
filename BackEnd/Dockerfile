FROM node:24

WORKDIR /app

# Copy root .env
COPY ../.env .env

# Copy the source code and build the app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
