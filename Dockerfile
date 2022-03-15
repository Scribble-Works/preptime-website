FROM node:14

ENV PORT=8080

EXPOSE 8080

COPY . ./

RUN ls

RUN yarn install

CMD [ "yarn", "start" ]