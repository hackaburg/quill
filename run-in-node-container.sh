#!/bin/bash

exec docker run \
  --rm \
  -it \
  -v `pwd`:/app \
  -w /app \
  -u 1000:1000 \
  node:latest \
    $@
