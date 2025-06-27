# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]