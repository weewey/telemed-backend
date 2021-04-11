# qdoc

[![QDOC CI](https://github.com/hau-zy/qdoc/actions/workflows/ci.yaml/badge.svg)](https://github.com/hau-zy/qdoc/actions/workflows/ci.yaml)

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
npm run dev
```


- run app
```shell
npm run dev
```
