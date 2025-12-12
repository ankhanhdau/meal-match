# 1. Base Image: Use a lightweight Node version (Alpine)
FROM node:18-alpine

# 2. Working Directory: Where our app lives inside the container
WORKDIR /app

# 3. Install Dependencies First (Caching Layer)
# We copy package.json BEFORE source code. 
# Docker caches this step. If you change code but not packages, npm install is skipped!
COPY package*.json ./
RUN npm ci --only=production

# 4. Copy Source Code
COPY . .

# 5. Build TypeScript
# (Assumes you have a "build" script in package.json: "tsc")
RUN npm run build

# 6. Exposure (Documentation only)
EXPOSE 3001

# 7. Default Command (Can be overridden)
CMD ["npm", "start"]