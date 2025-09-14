import mongoose from 'mongoose';
import { BlockchainService } from '../services/BlockchainService';
import { Kyc } from '../models/Kyc';
import dotenv from 'dotenv';

dotenv.config();

async function generateBlockchainIds() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety_db');
        console.log('Connected to MongoDB');

        // Get all KYC records
        const kycRecords = await Kyc.find({});
        console.log(`Found ${kycRecords.length} KYC records`);

        // Initialize blockchain service
        const blockchainService = await BlockchainService.getInstance();

        // Process each record
        for (const kyc of kycRecords) {
            try {
                const identityNumber = kyc.aadharNumber || kyc.passportNumber;
                if (!identityNumber) {
                    console.log(`Skipping record for ${kyc.name}: No identity number found`);
                    continue;
                }

                // Generate blockchain record using tour dates
                const blockchainRecord = await blockchainService.registerTourist(
                    identityNumber,
                    `TRIP-${Date.now()}`,
                    kyc.tourDates.startDate,
                    kyc.tourDates.endDate,
                    kyc.aadharNumber ? 'aadhar' : 'passport'
                );

                // Update MongoDB record with blockchain details
                const updatedKyc = await Kyc.findByIdAndUpdate(
                    kyc._id,
                    {
                        $set: {
                            blockchainId: blockchainRecord.docHash,
                            blockchainData: {
                                tripId: blockchainRecord.tripId,
                                validFrom: blockchainRecord.validFrom,
                                validUntil: blockchainRecord.validUntil,
                                timestamp: blockchainRecord.timestamp,
                                verificationType: blockchainRecord.verificationType,
                                tourDates: kyc.tourDates
                            }
                        }
                    },
                    { new: true }
                );

                if (!updatedKyc) {
                    console.log(`Failed to update KYC record for ${kyc.name}`);
                    continue;
                }

                console.log(`Updated KYC record for ${kyc.name}:`);
                console.log(`- Blockchain ID: ${updatedKyc.blockchainId}`);
                if (updatedKyc.blockchainData) {
                    console.log(`- Trip ID: ${updatedKyc.blockchainData.tripId}`);
                    console.log(`- Tour Start: ${updatedKyc.tourDates.startDate}`);
                    console.log(`- Tour End: ${updatedKyc.tourDates.endDate}`);
                }
                console.log('-------------------');

            } catch (recordError) {
                console.error(`Error processing record for ${kyc.name}:`, recordError);
            }
        }

        // Verify chain integrity
        const isValid = await blockchainService.verifyChain();
        console.log(`\nBlockchain integrity check: ${isValid ? 'PASSED' : 'FAILED'}`);

        // Print final statistics
        const updatedCount = await Kyc.countDocuments({ blockchainId: { $exists: true } });
        console.log(`\nProcessing complete:`);
        console.log(`- Total records: ${kycRecords.length}`);
        console.log(`- Records with blockchain IDs: ${updatedCount}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed');
    }
}

// Run the script
generateBlockchainIds();