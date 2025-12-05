FROM node:18.12-buster-slim
WORKDIR /greeting-cards-ui
ENV PATH=/greeting-cards-ui/node_modules/.bin:$PATH
COPY package.json /greeting-cards-ui
COPY package-lock.json /greeting-cards-ui
RUN npm install
COPY . /greeting-cards-ui
CMD ["npm", "start"]
