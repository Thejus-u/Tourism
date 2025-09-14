import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import kycRoutes from './routes/kyc';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());

// MongoDB Connection with collection initialization
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety_db')
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      await mongoose.connection.createCollection('kycs');
      console.log('KYCs collection created');
    } catch (error: any) {
      if (error.code !== 48) {
        console.error('Error creating KYCs collection:', error);
      } else {
        console.log('KYCs collection already exists');
      }
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});