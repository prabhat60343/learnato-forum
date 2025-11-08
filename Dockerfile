# Use an official Node image so npm is available during build
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies: use npm ci if package-lock.json exists, otherwise fallback to npm install (production-only)
RUN if [ -f package-lock.json ]; then \
        npm ci --omit=dev; \
    else \
        npm install --omit=dev; \
    fi

# Copy rest of the application
COPY . .

# Ensure production env by default (adjust if you want development)
ENV NODE_ENV=production
ENV PORT=5000

# Expose port used by your backend
EXPOSE 5000

# Start the app (requires "start" script in package.json)
CMD ["npm", "start"]
