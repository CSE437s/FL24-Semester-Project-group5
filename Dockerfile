FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
COPY . .
RUN npm i -g prisma 
RUN npx prisma generate
EXPOSE 3000
CMD npm run dev