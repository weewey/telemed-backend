# qdoc

[![Staging CI](https://github.com/qdoctech/qdoc/actions/workflows/staging-ci.yml/badge.svg?branch=main)](https://github.com/qdoctech/qdoc/actions/workflows/staging-ci.yml)

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

- Install husky (which is used to run pre-push git hook)
```
npx husky install
```

- start docker
```shell
docker-compose up -d
```

- init db
```shell
npm run db:setup
```

- run test
```shell
npm test
```

- seed db
```shell
npm run db:seed
```


- run app
```shell
npm run dev
```
