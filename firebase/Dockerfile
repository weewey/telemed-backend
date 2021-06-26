FROM andreysenov/firebase-tools:latest

WORKDIR /home/node

COPY firebase.json .

CMD ["firebase", "emulators:start", "--project", "local"]