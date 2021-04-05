# qdoc

## Requirements
- node v15.12.0

## Setup

- copy `.envrc.template`
```shell
cp .envrc.template .envrc
```

If you do not have `direnv` installed then you have to
```
source .envrc
```

Otherwise with `direnv` installed
```
direnv allow
```

- Install dependencies
```
npm i
```

- start docker
```shell
docker-compose up -d
```

- init db
```shell
npm run db:setup
```

- run app
```shell
npm run dev
```