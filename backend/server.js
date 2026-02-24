import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS configuration
const getAllowedOrigins = () => {
  if (!process.env.FRONTEND_URL) {
    return '*'; // Allow all in development
  }
  
  // Remove trailing slash from FRONTEND_URL if present
  const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  
  return (origin, callback) => {
    // Allow requests from the frontend URL (with or without trailing slash)
    if (!origin || origin === baseUrl || origin === baseUrl + '/') {
      callback(null, true);
    } else {
      callback(null, true); // Allow for now to debug
    }
  };
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '8-Puzzle Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      leaderboard: '/api/leaderboard',
      leaderboard_top: '/api/leaderboard/top',
      stats: '/api/leaderboard/stats'
    }
  });
});

// Admin route for debugging
app.get('/debug', (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    frontend_url: process.env.FRONTEND_URL || 'Not set'
  });
});

// Routes
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`Connected to frontend: ${process.env.FRONTEND_URL}`);
});
