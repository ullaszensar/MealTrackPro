# Installation Guide for Meal Planning System

This document provides step-by-step instructions for setting up the Meal Planning System in different environments.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/meal-planning-system.git
   cd meal-planning-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   This command starts both the backend Express server and the frontend Vite development server.

4. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

5. **Login with demo credentials**

   - Admin User:
     - Username: `admin`
     - Password: `password`
   
   - Staff User:
     - Username: `staff`
     - Password: `password`

## Production Deployment

### Build the Application

1. **Create production build**

   ```bash
   npm run build
   ```

   This creates optimized production builds for both the client and server.

2. **Start the production server**

   ```bash
   npm start
   ```

### Deploying to a Server

#### Using PM2 (Node.js Process Manager)

1. **Install PM2 globally**

   ```bash
   npm install -g pm2
   ```

2. **Start the application with PM2**

   ```bash
   pm2 start npm --name "meal-planning-system" -- start
   ```

3. **Set up PM2 to start on system boot**

   ```bash
   pm2 startup
   pm2 save
   ```

#### Using Docker

1. **Build Docker image**

   Create a `Dockerfile` in the root directory:

   ```Dockerfile
   FROM node:16-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .
   RUN npm run build

   EXPOSE 5000

   CMD ["npm", "start"]
   ```

2. **Build and run with Docker**

   ```bash
   docker build -t meal-planning-system .
   docker run -p 5000:5000 -d meal-planning-system
   ```

## Database Configuration

By default, the application uses in-memory storage. For production use, you can configure it to use PostgreSQL.

### Setting Up PostgreSQL

1. **Install PostgreSQL** (if not already installed)

2. **Create a database**

   ```sql
   CREATE DATABASE meal_planning;
   CREATE USER meal_planner WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE meal_planning TO meal_planner;
   ```

3. **Update database configuration**

   Edit the `server/storage.ts` file to use the DatabaseStorage implementation instead of MemStorage.

4. **Set environment variables**

   ```
   DATABASE_URL=postgresql://meal_planner:your_password@localhost:5432/meal_planning
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development  # or production

# Session Configuration
SESSION_SECRET=your_strong_secret_key

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## Troubleshooting

### Common Issues

1. **Port already in use**

   If port 5000 is already in use, you can change it in the `.env` file:
   
   ```
   PORT=5001
   ```

2. **Database connection issues**

   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure the database exists
   - Test connection with `psql` command line tool

3. **Node.js version issues**

   The application requires Node.js v14 or higher. Check your version:
   
   ```bash
   node --version
   ```

   If needed, update Node.js using nvm (Node Version Manager):
   
   ```bash
   nvm install 16
   nvm use 16
   ```

### Getting Help

If you encounter any issues not covered in this guide, please open an issue on the GitHub repository or contact the maintainer at support@mealplanningsystem.com.