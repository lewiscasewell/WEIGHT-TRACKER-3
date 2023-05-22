FROM node:18-alpine AS builder

RUN apk update && apk add --update --no-cache bash openssl1.1-compat python3 py3-pip make g++

WORKDIR /server

COPY server/package.json .
COPY server/yarn.lock .

RUN yarn install

COPY server .

RUN yarn build

FROM softonic/node-prune:latest AS pruner
WORKDIR /server

COPY --from=builder /server/ ./
RUN node-prune ./node_modules

FROM node:18-alpine
RUN apk update && apk add --update --no-cache bash openssl1.1-compat
WORKDIR /server

COPY --from=pruner /server/ ./

RUN yarn migrate

CMD ["yarn", "start"]

