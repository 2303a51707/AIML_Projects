const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL || 'https://resumatch-hub.vercel.app'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ResuMatch API is running' });
});

let isConnected = false;

async function connectToMongoDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const connectDB = require('./config/db');
  await connectDB();
  isConnected = true;
}

app.use('/api', async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (err) {
    isConnected = false;
    const msg = err.message.includes('Authentication')
      ? 'Database authentication failed. Check credentials.'
      : err.message.includes('whitelist')
        ? 'Your IP is not whitelisted. Add it in MongoDB Atlas Network Access.'
        : err.message.includes('querySrv')
          ? 'DNS SRV lookup failed. Try a non-SRV connection string or check your DNS.'
          : 'Database connection failed. Please try again later.';
    return res.status(503).json({ message: msg });
  }
});

const authRoutes = require('./routes/authRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API: https://resumatchai-three.vercel.app/api`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Kill the existing process or use a different PORT.`);
      process.exit(1);
    }
    console.error('Server error:', err.message);
    process.exit(1);
  });

  async function handleShutdown() {
    console.log('Shutting down gracefully...');
    await new Promise((resolve) => server.close(resolve));
    console.log('HTTP server closed.');
    const { gracefulShutdown } = require('./config/db');
    await gracefulShutdown();
    console.log('Cleanup complete. Exiting.');
    process.exit(0);
  }

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

module.exports = app;
