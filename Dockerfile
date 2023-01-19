FROM alpine:3.17

COPY ./ /opt
WORKDIR /opt

RUN apk --no-cache --update --upgrade add nodejs-current yarn

RUN yarn install --production && yarn cache clean

CMD yarn start