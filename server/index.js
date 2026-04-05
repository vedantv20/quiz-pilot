require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const path = require('path');

const connectDB = require('./config/database');
const { errorHandler } = require('./middleware');

const app = express();

// Security middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// Log allowed origins for debugging
console.log('🔒 Allowed CORS origins:', allowedOrigins);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools like curl/postman (no Origin header)
    if (!origin) return callback(null, true)

    // Check if origin is in the allowed list
    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed.replace(/\/$/, '')))) {
      return callback(null, true)
    }

    console.error(`❌ CORS blocked for origin: ${origin}`);
    console.error(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuizPilot Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/upload', require('./routes/upload'));

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB (non-blocking)
    await connectDB();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`
🚀 QuizPilot Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🕐 Started at: ${new Date().toLocaleString()}
      `);
      
      // Start self-polling mechanism after server is running
      startSelfPolling(PORT);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Self-polling mechanism to keep server alive
const startSelfPolling = (port) => {
  const getRandomInterval = () => {
    // Random interval between 10-12 minutes (600,000-720,000 ms)
    const minInterval = 10 * 60 * 1000; // 10 minutes
    const maxInterval = 12 * 60 * 1000; // 12 minutes
    return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
  };

  const performHealthCheck = async () => {
    try {
      const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
      const healthUrl = `${serverUrl}/health`;
      
      console.log(`🏥 Performing self health check at ${new Date().toLocaleString()}`);
      
      const response = await axios.get(healthUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'QuizPilot-SelfPolling/1.0'
        }
      });
      
      if (response.status === 200) {
        console.log(`✅ Health check successful - Server is alive`);
      }
    } catch (error) {
      console.error(`❌ Health check failed:`, error.message);
      // Even if health check fails, we'll continue polling
    }
    
    // Schedule next health check with random interval
    const nextInterval = getRandomInterval();
    const nextCheckTime = new Date(Date.now() + nextInterval);
    
    console.log(`⏰ Next health check scheduled in ${Math.floor(nextInterval / 60000)} minutes at ${nextCheckTime.toLocaleString()}`);
    
    setTimeout(performHealthCheck, nextInterval);
  };

  // Only enable self-polling in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SELF_POLLING === 'true') {
    console.log(`🔄 Self-polling mechanism enabled`);
    
    // Start first health check after 10 minutes
    const initialDelay = 10 * 60 * 1000;
    setTimeout(performHealthCheck, initialDelay);
    
    console.log(`⏰ First health check scheduled in 10 minutes at ${new Date(Date.now() + initialDelay).toLocaleString()}`);
  } else {
    console.log(`⚠️  Self-polling disabled (set NODE_ENV=production or ENABLE_SELF_POLLING=true to enable)`);
  }
};

// Start the server
startServer();

module.exports = app;
