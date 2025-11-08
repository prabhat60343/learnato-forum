# Use an official Node image so npm is available during build
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
# ...existing code (if you have yarn.lock or other package files, copy them too)...
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy rest of the application
COPY . .

# Ensure production env by default (adjust if you want development)
ENV NODE_ENV=production
ENV PORT=5000

# Expose port used by your backend
EXPOSE 5000

# Start the app (requires "start" script in package.json)
CMD ["npm", "start"]
