// server/index.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const aiProxy = require('./ai-proxy');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security: CORS ---
// Allow only your frontend origin in production
const allowedOrigins = [
  'http://localhost:8080',   // dev
  'http://localhost:5173',   // Vite
  'https://your-booktins-domain.com' // ← REPLACE with your domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false
}));

// --- Security: Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window
  message: {
    error: "Too many AI requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/enhance', limiter);

// --- Body Parser ---
app.use(express.json({ limit: '10mb' }));

// --- Routes ---
app.use('/api', aiProxy);

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 BookTins AI Proxy running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   AI endpoint:  POST /api/enhance`);
});