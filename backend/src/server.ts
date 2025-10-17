import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ========== DATABASE SETUP ==========
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ========== REDIS SETUP ==========
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.connect();

// ========== MIDDLEWARE ==========

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081', 'http://localhost:19006'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Request ID for tracing
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = Math.random().toString(36).substring(7);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ========== ROUTES ==========
app.use('/api', routes);

// Root health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Celestia API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

// ========== ERROR HANDLING ==========

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.id,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred' 
    : err.message;

  res.status(500).json({
    error: 'Internal Server Error',
    message,
    requestId: req.id,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ========== SERVER STARTUP ==========
const startServer = async () => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('✅ Database connected');

    // Test Redis connection
    await redis.ping();
    console.log('✅ Redis connected');

    app.listen(PORT, () => {
      console.log(`🚀 Celestia API running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await db.end();
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connections...');
  await db.end();
  await redis.quit();
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

export default app;

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: {
        id: string;
        email: string;
        isAdmin: boolean;
      };
    }
  }
}