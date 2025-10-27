# -----------------------------------------------------------
# Stage 1: Builder - Installs dependencies and runs the build
# We use a Node.js image with build tools included.
# -----------------------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package metadata only to leverage Docker layer caching for dependencies
COPY package.json .
COPY package-lock.json .

# Install ONLY production dependencies (no dev dependencies like testing tools)
# This is crucial for small images
RUN npm install --only=production

# Copy the source code only after dependencies are installed.
# This ensures a commit to code doesn't invalidate the node_modules layer.
COPY . .

# Run any necessary build/prep scripts here, though usually not needed for pure Node.js APIs
# For a MERN/ERN stack, this stage mostly just prepares node_modules.


# -----------------------------------------------------------
# Stage 2: Production Runtime - Minimal image for execution
# We use a minimal node-based image for security and size.
# -----------------------------------------------------------
FROM node:18-alpine 

# Set the working directory for the final image
WORKDIR /app

# Copy the production node_modules from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application code from the 'builder' stage
# This copies index.js, routes/, middleware.js, db.js etc.
COPY --from=builder /app .

# Expose the correct port. Your backend/index.js must listen on this.
# Based on common Node.js practice, let's assume 5000 is used by your backend.
EXPOSE 3000

# The command to run the application (index.js is the entry point)
CMD ["node", "index.js"]