# Ultraship TMS Employee Portal

A full-stack employee management system built with the MERN stack, featuring authentication, task management, and GraphQL API. 
visit now at - https://ultraship-tms-employee-portal-assignment.onrender.com/

## Features

- 🔐 User authentication (login/signup)
- 👥 Employee management dashboard
- ✅ Task assignment and tracking
- 🎨 Modern, responsive UI
- 🔄 Real-time updates with GraphQL

## Tech Stack

**Frontend:**
- React.js
- Vite
- TailwindCSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- GraphQL (Apollo Server)
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v20.20.0)
- MongoDB
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/darshanpawar101/ultraship-tms-employee-portal-assignment.git
cd ultraship-tms-employee-portal-assignment
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables

Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

4. Run the application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`

## Deployment

The application is configured for deployment on Render. Make sure to:
- Set environment variables in Render dashboard
- Use Express 4.x for compatibility
- Build command: `npm install && npm run build --prefix frontend`
- Start command: `npm run start --prefix backend`

## License

MIT
