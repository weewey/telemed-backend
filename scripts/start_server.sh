#!/usr/bin/env bash

echo "Running DB Migrations"

npm run db:migrate

echo "Start Server"

npm run prod