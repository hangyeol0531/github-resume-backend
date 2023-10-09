FROM --platform=linux/amd/v8 node:16-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run test
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]