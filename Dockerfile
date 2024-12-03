# Stage 1: Build the React application
# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the app using Apache
# Use an official Apache runtime as the base image
FROM httpd:2.4

# Copy the built files to the Apache web directory
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/
