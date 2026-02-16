FROM node:20-slim

WORKDIR /greeting-cards-ui
ENV PATH=/greeting-cards-ui/node_modules/.bin:$PATH

COPY package.json /greeting-cards-ui
COPY package-lock.json /greeting-cards-ui

RUN npm ci

COPY . /greeting-cards-ui

EXPOSE 3000
CMD ["npm", "run", "dev"]
