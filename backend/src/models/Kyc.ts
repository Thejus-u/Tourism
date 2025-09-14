import mongoose from 'mongoose';

interface BlockchainData {
  tripId: string;
  validFrom: Date;
  validUntil: Date;
  timestamp: number;
  verificationType: 'aadhar' | 'passport';
  tourDates: {
    startDate: Date;
    endDate: Date;
  };
}

interface IKyc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  blockchainId: string;
  name: string;
  address: string;
  phoneNumber: string;
  aadharNumber?: string;
  passportNumber?: string;
  tourDates: {
    startDate: Date;
    endDate: Date;
  };
  idProofImage?: string;
  verificationType: 'aadhar' | 'passport';
  verificationNumber: string;
  blockchainData?: BlockchainData;
  createdAt: Date;
}

const kycSchema = new mongoose.Schema<IKyc>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockchainId: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  aadharNumber: {
    type: String,
    sparse: true,
    match: /^\d{12}$/
  },
  passportNumber: {
    type: String,
    sparse: true
  },
  idProofImage: {
    type: String
  },
  verificationType: {
    type: String,
    enum: ['aadhar', 'passport'],
    required: true
  },
  verificationNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blockchainData: {
    tripId: String,
    validFrom: Date,
    validUntil: Date,
    timestamp: Number,
    verificationType: {
      type: String,
      enum: ['aadhar', 'passport']
    }
  },
  tourDates: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }
}, {
  collection: 'kycs' // Explicitly specify collection name
});

// Add index for faster lookups
kycSchema.index({ blockchainId: 1 });
kycSchema.index({ verificationNumber: 1 });

// Create the Kyc model
export const Kyc = mongoose.model<IKyc>('Kyc', kycSchema);