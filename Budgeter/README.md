# Budgeter - Personal Finance Management Application

A modern, production-ready budgeting web application with user authentication, financial tracking, and goal management. Built with React, Node.js, Express, and PostgreSQL.

![Budgeter Logo](docs/logo.png)

## Features

### Core Features
- **Dashboard** - Overview of total balance, income, expenses, and savings progress with interactive charts
- **Income Tracking** - Add, edit, and delete income entries with source categorization
- **Expense Tracking** - Categorize expenses, filter by date/category, view spending history
- **Financial Goals** - Create savings and debt repayment goals with visual progress tracking
- **Budget Management** - Set weekly/monthly budgets with overspending alerts

### Additional Features
- **Dark Mode** - Toggle between light and dark themes
- **Data Export** - Export your data in JSON or CSV format (GDPR compliant)
- **Notifications** - Alerts for budget limits and goal milestones
- **Privacy Compliance** - Australian Privacy Act 1988 and GDPR compliant

### Security Features
- JWT-based authentication with secure password hashing (bcrypt)
- Input validation and sanitization
- Rate limiting on authentication routes
- XSS and CSRF protection
- SQL injection prevention via parameterized queries

## Tech Stack

### Frontend
- React 18
- React Router 6
- Tailwind CSS 3
- Chart.js / Recharts
- Zustand (state management)
- Axios (HTTP client)

### Backend
- Node.js 18+
- Express 4
- PostgreSQL 14+
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- express-validator (validation)
- Helmet (security headers)

## Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 14 or higher
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/budgeter.git
cd budgeter
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE budgeter;

# Exit
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=budgeter
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_super_secret_key

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional for local development)
cp .env.example .env

# Start development server
npm start
```

The frontend development server will start on `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=budgeter
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=Budgeter
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile
- `DELETE /api/auth/account` - Delete account
- `GET /api/auth/data-export` - Export user data

### Income
- `GET /api/income` - List income entries
- `POST /api/income` - Create income entry
- `PATCH /api/income/:id` - Update income entry
- `DELETE /api/income/:id` - Delete income entry
- `GET /api/income/stats/by-source` - Income by source
- `GET /api/income/stats/monthly/:year` - Monthly breakdown

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/by-category` - Expenses by category
- `GET /api/expenses/stats/monthly/:year` - Monthly breakdown

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/progress` - Add progress to goal
- `GET /api/goals/upcoming/deadlines` - Upcoming goal deadlines

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PATCH /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/:id/progress` - Get budget progress
- `GET /api/budgets/alerts/overspending` - Check overspending alerts

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/stats` - Get quick stats

## Project Structure

```
budgeter/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Database connection
│   │   │   └── migrate.js       # Database migrations
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── security.js      # Security middleware
│   │   │   └── validation.js    # Input validation
│   │   ├── models/
│   │   │   ├── user.js          # User model
│   │   │   ├── income.js        # Income model
│   │   │   ├── expense.js       # Expense model
│   │   │   ├── goal.js          # Goal model
│   │   │   ├── budget.js        # Budget model
│   │   │   ├── category.js      # Category model
│   │   │   └── notification.js    # Notification model
│   │   ├── routes/
│   │   │   ├── auth.js          # Auth routes
│   │   │   ├── income.js        # Income routes
│   │   │   ├── expenses.js      # Expense routes
│   │   │   ├── goals.js         # Goal routes
│   │   │   ├── budgets.js       # Budget routes
│   │   │   ├── categories.js    # Category routes
│   │   │   ├── notifications.js # Notification routes
│   │   │   └── dashboard.js     # Dashboard routes
│   │   ├── utils/
│   │   │   ├── helpers.js       # Utility functions
│   │   │   └── csvExport.js     # CSV export utilities
│   │   └── server.js            # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Layout components
│   │   │   ├── ui/              # UI components
│   │   │   ├── charts/          # Chart components
│   │   │   └── ProtectedRoute.js
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Page components
│   │   ├── utils/               # Utility functions
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── database/                     # Database scripts
├── docs/                         # Documentation
└── README.md
```

## Running in Production

### Backend

```bash
cd backend
npm install
npm run migrate
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run build
```

The build folder can be served using any static file server or CDN.

## Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt with a salt round of 12
2. **JWT Tokens**: Short expiration with secure secret key
3. **Rate Limiting**: Implemented on authentication routes
4. **Input Validation**: All user inputs are validated and sanitized
5. **CORS**: Configured to allow only specified origins
6. **Helmet**: Security headers for common vulnerabilities
7. **SQL Injection**: Prevented via parameterized queries

## Privacy Compliance

### Australian Privacy Act 1988 (APPs)
- APP 1: Open and transparent management of personal information
- APP 3: Collection of solicited personal information
- APP 5: Notification of collection
- APP 11: Security of personal information
- APP 12: Access to personal information
- APP 13: Correction of personal information

### GDPR Compliance
- Right to access personal data
- Right to data portability (export functionality)
- Right to erasure (account deletion)
- Consent management
- Data minimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@budgeter.app or open an issue on GitHub.

## Acknowledgments

- React Team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- PostgreSQL for the reliable database system
- Express.js team for the backend framework
