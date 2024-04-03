FROM node:17.4.0-alpine
WORKDIR /usr/src/bot

RUN npm install discord.js
RUN npm install firebase
RUN npm install firebase-admin
RUN npm install firebase-functions
RUN npm install axios
RUN npm install node-cron
RUN apk add curl

COPY . .