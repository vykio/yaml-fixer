# Use Node.js LTS as the base image
FROM node:lts

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY prettify.js prettify.js
COPY .prettierrc .prettierrc

RUN echo $(pwd)
RUN echo $(ls -la .)

# Specify the command to run the application
ENTRYPOINT ["node", "prettify.js"]