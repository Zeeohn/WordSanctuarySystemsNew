# Deploying data-layer-microservice on Render

This guide explains how to deploy the data-layer-microservice on Render.

## Prerequisites

Before deploying, make sure you have:

1. A Render account
2. Access to both MongoDB and PostgreSQL databases
3. Connection strings for both databases

## Deployment Steps

### 1. Connect Your Repository

1. Sign in to Render.com
2. Navigate to the Dashboard
3. Click "New" button
4. Select "Web Service"
5. Connect your GitHub/GitLab repository
6. Select the repository containing the data-layer-microservice

### 2. Configure the Web Service

**Basic Settings:**
- **Name:** `data-layer-microservice` (or your preferred name)
- **Runtime:** `Node`
- **Root Directory:** `server` (since your code is in the server subdirectory)
- **Region:** Choose the region closest to your users or other services

**Build & Deploy Settings:**
- **Build Command:** `npm install && npm run prisma-generate-mongodb && npm run prisma-generate-postgresql && ./scripts/db-migrate.sh && npm run build`
- **Start Command:** `node dist/app.js`

### 3. Set Environment Variables

Add the following environment variables:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will automatically use this port)
- `MONGODB_CONN_URI`: Your MongoDB connection string
- `POSTGRES_CONN_URI`: Your PostgreSQL connection string

These can be set in the Render dashboard under Environment settings for your service.

### 4. Advanced Database Configuration

**PostgreSQL:**
- If using a Render PostgreSQL database, you can link it directly
- For external PostgreSQL, ensure it accepts connections from Render's IP ranges

**MongoDB:**
- Ensure your MongoDB Atlas cluster (if using Atlas) has network access from anywhere or add Render's IP addresses to the allowlist

## Monitoring Your Deployment

After deployment:
1. Check Render logs for any deployment issues
2. Verify database connections are working properly
3. Test your API endpoints to ensure everything is functioning correctly

## Troubleshooting

- **Database Connection Issues:** Verify connection strings and network access
- **Build Failures:** Check Render logs for specific error messages
- **Runtime Errors:** Check application logs in the Render dashboard
