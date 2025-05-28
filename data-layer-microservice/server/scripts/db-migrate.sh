#!/bin/bash
# This script handles database migrations for both MongoDB and PostgreSQL
# It should be run as part of the build process on Render

echo "Starting database migrations..."

# PostgreSQL migrations (uses Prisma migrate)
echo "Running PostgreSQL migrations..."
npx prisma migrate deploy --schema=prisma/schema.postgresql.prisma

# MongoDB doesn't support traditional migrations, but we can ensure the client is generated
echo "Generating MongoDB client..."
npx prisma generate --schema=prisma/schema.mongodb.prisma

echo "Database migrations completed"
