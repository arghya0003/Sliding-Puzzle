import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security: Helmet for HTTP headers
app.use(helmet());

// Security: Request size limit (prevents large payload attacks)
app.use(express.json({ limit: '10kb' }));

// Security: Rate limiting - general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Security: Stricter rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Stricter limit for API
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Security: POST endpoint limiter (even stricter)
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Only 20 POST requests per 15 min
  skipSuccessfulRequests: false,
  message: 'Too many score submissions. Please wait before submitting again.',
});

// Apply general rate limiter to all routes
app.use(limiter);

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

// Routes with specific rate limiters
app.use('/api/leaderboard', apiLimiter, leaderboardRoutes);

// Health check (no rate limiting)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running', 
    timestamp: new Date().toISOString(),
    security: 'enabled'
  });
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
