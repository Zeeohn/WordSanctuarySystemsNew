# Step 1: Use an official Node.js image as the build environment
FROM node:18 AS builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install the dependencies (both production and development)
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Compile the TypeScript code to JavaScript
RUN npm run build

# Step 7: Use a smaller base image for production (node:16-slim)
FROM node:18-slim

# Step 8: Set the working directory in the container for production
WORKDIR /app

# Step 9: Copy the compiled app from the builder stage
COPY --from=builder /app ./

# Step 10: Expose the port the app will run on
EXPOSE 5003

# Step 11: Run the application
CMD ["node", "dist/app.js"]
