FROM node
WORKDIR /usr/src/api

#root
USER root 

COPY . .
# COPY package*.json ./
RUN npm install
RUN npm install axios
RUN npm install typescript
RUN npm install ts-node
RUN npm install express