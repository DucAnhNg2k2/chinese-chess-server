FROM node:18.16
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install pm2 -g
CMD ["pm2-runtime", "dist/main.js"]