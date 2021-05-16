FROM node:15.12.0

ENV NODE_ENV=production

WORKDIR /qdoc

COPY package.json /qdoc

RUN npm install

ADD . /qdoc

CMD ["npm", "run", "prod"]