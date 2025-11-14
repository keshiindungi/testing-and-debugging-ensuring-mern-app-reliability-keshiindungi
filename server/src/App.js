import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bugRoutes from './routes/bugs.js';

// Load environment variables first
dotenv.config();

console.log('🚀 Starting MERN Bug Tracker Server...');
console.log('📁 Environment:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
console.log('🗄️  MongoDB URI:', process.env.MONGO_URI ? 'Set (hidden for security)' : 'NOT SET!');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bugs', bugRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  console.log('✅ Health check received');
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({ error: 'Validation Error', details: errors });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Database connection with detailed logging
const connectDB = async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Check if MongoDB is running locally: mongod');
    console.log('   2. Verify your connection string in .env file');
    console.log('   3. Check network connection for Atlas');
    console.log('   4. Verify database user permissions');
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log('🎉 Server started successfully!');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🐛 API Base: http://localhost:${PORT}/api/bugs`);
      console.log('⏰ Server started at:', new Date().toISOString());
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Server shutting down...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

export default app;