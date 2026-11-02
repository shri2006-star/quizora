require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./backend/config/db');
const errorHandler = require('./backend/middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/categories', require('./backend/routes/categoryRoutes'));
app.use('/api/questions', require('./backend/routes/questionRoutes'));
app.use('/api/quiz', require('./backend/routes/quizRoutes'));
app.use('/api/results', require('./backend/routes/resultRoutes'));
app.use('/api/users', require('./backend/routes/userRoutes'));
app.use('/api/leaderboard', require('./backend/routes/leaderboardRoutes'));
app.use('/api/stats', require('./backend/routes/statsRoutes'));

// Serve the SPA for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║       🎓 Quizora Server Running      ║`);
  console.log(`  ║  http://localhost:${PORT}               ║`);
  console.log(`  ║  Environment: ${process.env.NODE_ENV || 'development'}          ║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
});

module.exports = app;
