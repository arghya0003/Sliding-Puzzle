import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS configuration - allow frontend URL or all origins in development
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
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
