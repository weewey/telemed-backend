#!/bin/bash

docker build . -t firebase-auth-ci

docker tag firebase-auth-ci weewey/firebase-auth-ci:latest

docker push weewey/firebase-auth-ci:latest