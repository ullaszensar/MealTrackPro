# Meal Planning System

A comprehensive web application for staff to submit meal counts with an admin dashboard for monitoring and reporting.

## Overview

The Meal Planning System is designed to streamline the food planning process in organizational settings. It allows staff members to submit meal counts for the upcoming days, while administrators can monitor submissions, generate reports, and manage users.

## Features

- **User Authentication**: Secure login system with role-based access control (Staff and Admin roles)
- **Staff Dashboard**: 
  - Submit meal counts for five meal types (Breakfast, Lunch, Tea, Dinner, and Supper)
  - View submission history
  - Time-based restrictions (after 10 PM, can only submit for day after tomorrow)
  - One submission per day restriction
- **Admin Dashboard**:
  - Real-time overview of all meal submissions
  - Meal planning management (approve/adjust submissions)
  - Reporting tools with charts and data visualization
  - User management functionality
  - Configurable system settings

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express
- **Database**: In-memory storage (can be configured for PostgreSQL)
- **Authentication**: Passport.js with session-based auth
- **Data Visualization**: Chart.js
- **Form Validation**: react-hook-form with Zod schemas

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/meal-planning-system.git
   cd meal-planning-system
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Access the application
   - Open your browser and navigate to: `http://localhost:5000`
   - Default login credentials:
     - Admin: username `admin`, password `password`
     - Staff: username `staff`, password `password`

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/pages/`: Application pages
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions and services
- `server/`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Data storage implementation
- `shared/`: Shared code between client and server
  - `schema.ts`: Data models and validation schemas

## Usage

### Staff Users

1. Log in with staff credentials
2. Navigate to the dashboard
3. Fill in the meal submission form for the desired date
4. Submit the form to record the meal counts

### Admin Users

1. Log in with admin credentials
2. View the dashboard for an overview of all meal submissions
3. Navigate to the Meal Planning section to approve or adjust submissions
4. Use the Reports section to generate visualizations of meal data
5. Manage users in the User Management section
6. Configure system settings in the Settings section

## Development

### Running Tests

```
npm test
```

### Building for Production

```
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.