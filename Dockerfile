FROM node:alpine

COPY . /app
WORKDIR /app

RUN yarn install
RUN yarn run config
EXPOSE 3000

USER 1000:1000
CMD [ "yarn", "start" ]
