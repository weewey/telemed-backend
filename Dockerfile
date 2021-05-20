FROM node:15.12.0

USER root

ENV NODE_ENV=build

WORKDIR /qdoc

COPY package*.json tsconfig*.json ./

RUN npm install

RUN npm install --only=dev

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

RUN chmod +x ./scripts/start_server.sh

CMD ["./scripts/start_server.sh"]