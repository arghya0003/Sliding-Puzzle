import jwt from 'jsonwebtoken';

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Generate JWT token (optional - for future user authentication)
 */
export function generateToken(userId) {
  return jwt.sign({ userId, timestamp: Date.now() }, JWT_SECRET, {
    expiresIn: '24h'
  });
}

/**
 * Verify JWT token middleware
 */
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Input sanitization - remove HTML/script tags
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validate and sanitize scoring data
 */
export function validateScoreData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' };
  }
  
  return { valid: true, data };
}

/**
 * IP-based fingerprinting for detecting spam
 */
const submissionMap = new Map();

export function trackSubmission(ip, playerName) {
  const key = `${ip}:${playerName}`;
  const now = Date.now();
  
  if (!submissionMap.has(key)) {
    submissionMap.set(key, []);
  }
  
  const timestamps = submissionMap.get(key);
  // Remove old entries (older than 1 minute)
  const recentTimestamps = timestamps.filter(t => now - t < 60000);
  recentTimestamps.push(now);
  submissionMap.set(key, recentTimestamps);
  
  return recentTimestamps.length;
}

/**
 * Check if submission is spam (more than 5 per minute per player)
 */
export function isSpamSubmission(ip, playerName) {
  const count = trackSubmission(ip, playerName);
  return count > 5;
}
