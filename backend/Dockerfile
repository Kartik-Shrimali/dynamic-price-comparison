# Dockerfile - FINAL FUNCTIONAL BACKEND VERSION
FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
# This installs dependencies directly into the final image
RUN npm install --only=production 
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]