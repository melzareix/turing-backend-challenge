FROM node:10.0.0

RUN yarn global add nodemon@1.19.0

RUN mkdir -p /usr/src/app

WORKDIR /tmp

ADD ./server/package.json .
ADD ./server/yarn.lock .

RUN yarn

RUN cd /usr/src/app && ln -s /tmp/node_modules
ADD /server /usr/src/app/

WORKDIR /usr/src/app/

CMD ["yarn", "start"]
EXPOSE 4000
