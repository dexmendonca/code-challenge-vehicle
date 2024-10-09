FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
EXPOSE 3000
RUN npm run format
RUN npm run lint
RUN npm run build
RUN npm run test
CMD ["npm", "run", "start:prod"]