import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load .env BEFORE any other imports that depend on env vars
dotenv.config();

import resumeRoutes from './routes/resume';

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://resumize-front.vercel.app/', // Local development
  process.env.FRONTEND_URL // Production Vercel URL
].filter(Boolean) as string[];
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('Resumize Backend API is running!');
});

// Routes
app.use('/api/resume', resumeRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Something went wrong';
  
  res.status(status).json({ error: message });
});

// Start server only in non-serverless environments (local dev)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
