# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]
