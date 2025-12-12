# ---------------------------------------
# Stage 1: The Builder (The Factory)
# ---------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including 'tsc' in devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the app (TypeScript -> JavaScript)
# This creates the /app/dist folder
RUN npm run build

# ---------------------------------------
# Stage 2: The Production Image (The Showroom)
# ---------------------------------------
FROM node:18-alpine

WORKDIR /app

# Copy package files again
COPY package*.json ./

# Install ONLY production dependencies (Keep image small and secure)
RUN npm ci --only=production

# Copy the compiled JS files FROM the 'builder' stage
# We leave the source code (.ts files) behind!
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3001

# Default command
CMD ["npm", "start"]