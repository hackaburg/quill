FROM node:latest

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install

COPY . /app

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN yarn bower install

RUN yarn build

EXPOSE 3000
USER 1000:1000

CMD [ "node", "app.js" ]
