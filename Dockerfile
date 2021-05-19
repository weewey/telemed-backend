FROM node:15.12.0

ENV NODE_ENV=production

WORKDIR /qdoc

COPY package.json .

RUN npm install

ADD . .

CMD ["npm", "run", "prod"]