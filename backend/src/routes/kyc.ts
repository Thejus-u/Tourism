import express, { Request } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Kyc } from '../models/Kyc';
import { BlockchainService } from '../services/BlockchainService';

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = async (req: AuthRequest, res: any, next: any) => {
  try {
    console.log('Auth Middleware - Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      userId: string;
      role: string;
    };
    
    req.user = decoded;
    console.log('User authenticated:', req.user);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Function to generate blockchain-style ID
const generateBlockchainId = (identityNumber: string): string => {
  const timestamp = Date.now().toString();
  const data = identityNumber + timestamp;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return `TID${hash.substring(0, 16)}`;
};

// Submit KYC route
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    console.log('========== KYC Submission Started ==========');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);

    const userId = req.user?.userId;
    if (!userId) {
      console.error('Authentication Error: No user ID in token');
      return res.status(401).json({ message: 'Authentication failed - user ID missing' });
    }

    // Log the data we're about to validate
    console.log('Validating KYC data...', {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      aadharNumber: req.body.aadharNumber,
      passportNumber: req.body.passportNumber
    });

    // Validate required fields with detailed logging
    const { name, address, phoneNumber } = req.body;
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!address) missingFields.push('address');
    if (!phoneNumber) missingFields.push('phoneNumber');
    
    if (missingFields.length > 0) {
      console.error('Validation Error: Missing fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields 
      });
    }

    // Validate and log identity document
    const identityNumber = req.body.aadharNumber || req.body.passportNumber;
    if (!identityNumber) {
      console.error('Validation Error: No identity document provided');
      return res.status(400).json({ message: 'Either Aadhar or Passport number is required' });
    }

    // Generate and log blockchain ID
    const blockchainId = generateBlockchainId(identityNumber);
    console.log('Generated blockchain ID:', blockchainId);

    // Register on blockchain
    const blockchainService = await BlockchainService.getInstance();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 90); // 90 days validity

    const blockchainRecord = await blockchainService.registerTourist(
      identityNumber,
      `TRIP-${Date.now()}`,
      new Date(),
      validUntil,
      req.body.aadharNumber ? 'aadhar' : 'passport'
    );

    // Create KYC document with blockchain reference
    console.log('Creating KYC document...');
    const kyc = new Kyc({
      userId,
      blockchainId: blockchainRecord.docHash,
      name,
      address,
      phoneNumber,
      aadharNumber: req.body.aadharNumber,
      passportNumber: req.body.passportNumber,
      idProofImage: req.body.idProofImage,
      verificationType: req.body.aadharNumber ? 'aadhar' : 'passport',
      verificationNumber: identityNumber
    });

    console.log('Attempting to save KYC document...');
    const savedKyc = await kyc.save();
    console.log('KYC saved successfully:', {
      id: savedKyc._id,
      blockchainId: savedKyc.blockchainId,
      name: savedKyc.name
    });

    return res.status(201).json({
      message: 'KYC submitted and registered on blockchain',
      kyc: savedKyc,
      blockchainVerification: blockchainRecord
    });

  } catch (error: any) {
    console.error('KYC Submission Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    // Send detailed error response
    return res.status(500).json({ 
      message: 'Error submitting KYC',
      error: {
        message: error.message,
        code: error.code,
        type: error.name
      }
    });
  } finally {
    console.log('========== KYC Submission Ended ==========');
  }
});

export default router;