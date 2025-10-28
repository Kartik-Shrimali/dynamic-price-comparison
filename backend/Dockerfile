# Dockerfile - FINAL FUNCTIONAL BACKEND VERSION

# We use a single, robust Node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package metadata
COPY package.json .
COPY package-lock.json .

# CRITICAL FIX: Install ALL dependencies directly into the final runtime image
# This bypasses the multi-stage copy failure and guarantees mysql2 is present.
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# Expose the correct port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]