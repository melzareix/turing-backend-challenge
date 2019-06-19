FROM node:10.0.0

RUN yarn global add nodemon@1.19.0

RUN mkdir -p /usr/src/app

WORKDIR /tmp

COPY ./server/package.json .
COPY ./server/yarn.lock .

RUN yarn

WORKDIR /usr/src/app/

RUN ln -s /tmp/node_modules .
COPY /server .

CMD ["yarn", "start"]
EXPOSE 4000
