FROM node:16.17.0-alpine

# Run on port 3000
EXPOSE 3000

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package and package/package-lock files
COPY package*.json .

# RUN cat .env

# Install all dependencies
RUN yarn install

# Copy the rest of the application source code
COPY . .

# List all files in the container's directory
RUN ls

# Run the web service on container startup.
CMD [ "yarn", "start" ]