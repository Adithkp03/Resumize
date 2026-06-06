import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/database';
import resumeRoutes from './routes/resume';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resume', resumeRoutes);

// Database initialization & Server start
initDb().then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
