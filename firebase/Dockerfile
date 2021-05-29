FROM andreysenov/firebase-tools:latest

EXPOSE 9098

WORKDIR /home/node

COPY firebase.json .

CMD ["firebase", "emulators:start", "--project", "testing"]