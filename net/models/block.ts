import { getHash } from '../utils.ts';
import { Transaction } from './interfaces.ts';

export class Block {
  idx: number;
  timestamp: number;
  transactions: Transaction[];
  prevHash: string;
  hash: string;
  nonce: number;

  constructor(timestamp = 0, transactions: Transaction[] = []) {
    this.idx = 0;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.prevHash = '';
    this.hash = Block.hashBlock(this);
    this.nonce = 0;
  }

  static hashBlock(block: Block): string {
    return getHash(
      block.idx +
        block.timestamp +
        JSON.stringify(block.transactions) +
        block.prevHash +
        block.nonce
    );
  }
}
