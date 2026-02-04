import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

import cron from 'node-cron';
import { checkInactivity } from './controllers/cronController.js';

// Setup automated inactivity monitor (running every minute for rapid responsiveness)
cron.schedule('* * * * *', async () => {
    console.log('Running automated inactivity monitor...');
    try {
        const { processed, notifications } = await checkInactivity();
        if (processed > 0) {
            console.log(`Automated monitor: Processed ${processed} users, sent ${notifications} notifications.`);
        }
    } catch (error) {
        console.error('Automated inactivity monitor failed:', error);
    }
});

const app = express();

// 1. CORS must be at the very top to handle preflight for all routes
app.use(cors({
    origin: true, // Dynamically mirror the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(morgan('dev'));

import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import cronRoutes from './routes/cronRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/assignments', assignmentRoutes);

app.get('/', (req, res) => {
  res.send('Asset Index API is running...');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
