FROM node:latest

COPY . /app
WORKDIR /app

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN yarn install
RUN yarn run config
EXPOSE 3000

USER 1000:1000
CMD [ "yarn", "start" ]
