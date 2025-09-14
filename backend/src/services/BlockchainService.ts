import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

interface BlockchainRecord {
  docHash: string;
  tripId: string;
  validFrom: Date;
  validUntil: Date;
  verificationType: 'aadhar' | 'passport';
  timestamp: number;
  previousHash: string;
}

export class BlockchainService {
  private static instance: BlockchainService;
  private chainFile: string;
  private lastHash: string;

  private constructor() {
    this.chainFile = path.join(__dirname, '../data/blockchain.json');
    this.lastHash = '0000000000000000000000000000000000000000000000000000000000000000';
  }

  static async getInstance(): Promise<BlockchainService> {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
      await BlockchainService.instance.initialize();
    }
    return BlockchainService.instance;
  }

  private async initialize() {
    try {
      await fs.mkdir(path.dirname(this.chainFile), { recursive: true });
      try {
        const data = await fs.readFile(this.chainFile, 'utf8');
        const chain = JSON.parse(data);
        if (chain.length > 0) {
          this.lastHash = chain[chain.length - 1].docHash;
        }
      } catch (error) {
        // File doesn't exist yet, will be created on first write
        await fs.writeFile(this.chainFile, '[]');
      }
    } catch (error) {
      console.error('Blockchain initialization error:', error);
      throw error;
    }
  }

  private calculateHash(data: any): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  async registerTourist(
    identityNumber: string,
    tripId: string,
    validFrom: Date,
    validUntil: Date,
    verificationType: 'aadhar' | 'passport'
  ): Promise<BlockchainRecord> {
    try {
      const record: BlockchainRecord = {
        docHash: '',
        tripId,
        validFrom,
        validUntil,
        verificationType,
        timestamp: Date.now(),
        previousHash: this.lastHash
      };

      // Calculate hash including previous hash for chain linking
      record.docHash = this.calculateHash({
        ...record,
        identityNumber // Include but don't store the identity number
      });

      // Save to blockchain file
      const chain = await this.getChain();
      chain.push(record);
      await fs.writeFile(this.chainFile, JSON.stringify(chain, null, 2));

      this.lastHash = record.docHash;
      return record;
    } catch (error) {
      console.error('Tourist registration error:', error);
      throw error;
    }
  }

  private async getChain(): Promise<BlockchainRecord[]> {
    try {
      const data = await fs.readFile(this.chainFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async verifyChain(): Promise<boolean> {
    const chain = await this.getChain();
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.docHash) {
        return false;
      }
    }
    return true;
  }

  async getChainState(): Promise<{
    totalBlocks: number;
    lastHash: string;
    isValid: boolean;
  }> {
    const chain = await this.getChain();
    return {
      totalBlocks: chain.length,
      lastHash: this.lastHash,
      isValid: await this.verifyChain()
    };
  }
}