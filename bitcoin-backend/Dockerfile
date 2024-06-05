FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . /app

EXPOSE 8080

CMD [ "node", "app.js" ]