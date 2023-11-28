FROM node:latest as base
WORKDIR /app
COPY package*.json ./

FROM base as dev
RUN npm install
COPY . .
ENV NODE_ENV development
CMD ["npm", "run", "dev"]

FROM base as build
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine as prod
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY ./.env.vault ./.env.vault
ENV NODE_ENV production
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]