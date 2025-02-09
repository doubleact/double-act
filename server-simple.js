import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/double-act')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
