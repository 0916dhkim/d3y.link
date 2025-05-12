FROM node:24 as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the app
COPY . .
RUN npm run build

FROM nginx:stable

COPY --from=build /app/build /usr/share/nginx/html

# Nginx config to handle client-side routing (React Router)
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
