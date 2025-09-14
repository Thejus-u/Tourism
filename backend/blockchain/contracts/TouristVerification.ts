import { Context, Contract } from 'fabric-contract-api';
import crypto from 'crypto';

interface TouristRecord {
    docHash: string;
    tripId: string;
    validFrom: string;
    validUntil: string;
    verificationType: 'aadhar' | 'passport';
    status: 'active' | 'expired' | 'revoked';
    authorizedDepartments: string[];
    metadata: {
        registrationTimestamp: string;
        lastUpdated: string;
        registeredBy: string;
    };
}

export class TouristVerificationContract extends Contract {

    // Initialize the chaincode
    async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    // Create new tourist verification record
    async createTouristRecord(ctx: Context, 
        identityNumber: string,
        tripId: string,
        validFrom: string,
        validUntil: string,
        verificationType: 'aadhar' | 'passport',
        departments: string[]
    ) {
        console.info('============= START : Create Tourist Record ===========');

        // Hash the identity document number
        const docHash = crypto
            .createHash('sha256')
            .update(identityNumber)
            .digest('hex');

        const record: TouristRecord = {
            docHash,
            tripId,
            validFrom,
            validUntil,
            verificationType,
            status: 'active',
            authorizedDepartments: departments,
            metadata: {
                registrationTimestamp: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                registeredBy: ctx.clientIdentity.getID()
            }
        };

        // Store the record on the ledger
        await ctx.stub.putState(docHash, Buffer.from(JSON.stringify(record)));
        
        console.info('============= END : Create Tourist Record ===========');
        return docHash;
    }

    // Query tourist record by document hash
    async queryTouristRecord(ctx: Context, docHash: string): Promise<TouristRecord | null> {
        const recordBytes = await ctx.stub.getState(docHash);
        if (!recordBytes || recordBytes.length === 0) {
            throw new Error(`Record with hash ${docHash} does not exist`);
        }
        return JSON.parse(recordBytes.toString());
    }

    // Verify if a tourist document is valid
    async verifyTourist(ctx: Context, identityNumber: string): Promise<boolean> {
        const docHash = crypto
            .createHash('sha256')
            .update(identityNumber)
            .digest('hex');

        const record = await this.queryTouristRecord(ctx, docHash);
        if (!record) return false;

        // Check if the record is active and not expired
        const now = new Date();
        const validUntil = new Date(record.validUntil);
        
        return record.status === 'active' && now <= validUntil;
    }

    // Update tourist record status
    async updateTouristStatus(ctx: Context, docHash: string, newStatus: 'active' | 'expired' | 'revoked') {
        const record = await this.queryTouristRecord(ctx, docHash);
        if (!record) {
            throw new Error(`Record with hash ${docHash} does not exist`);
        }

        // Verify caller has permission
        const callerMSPID = ctx.clientIdentity.getMSPID();
        if (!record.authorizedDepartments.includes(callerMSPID)) {
            throw new Error('Caller not authorized to update this record');
        }

        record.status = newStatus;
        record.metadata.lastUpdated = new Date().toISOString();

        await ctx.stub.putState(docHash, Buffer.from(JSON.stringify(record)));
        return record;
    }
}