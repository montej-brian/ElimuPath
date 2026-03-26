require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimiters');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const resultRoutes = require('./routes/resultRoutes');
const matchRoutes = require('./routes/matchRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const associateRoutes = require('./routes/associateRoutes');

app.use('/auth', authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/results', associateRoutes);
app.use('/api/results', historyRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('ElimuPath API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
