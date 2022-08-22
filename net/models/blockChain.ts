import { Block } from './block.ts';
import { Transaction } from './interfaces.ts';
import { sortBy } from '../utils.ts';

export class BlockChain {
  chain: Block[];
  pendingTransactions: Transaction[];
  difficulty: number;

  constructor() {
    this.chain = [this.getGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = 2;
  }

  getGenesisBlock(): Block {
    const now = Date.now();
    return new Block(now);
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addNewTransaction(newTransaction: Transaction) {
    this.pendingTransactions = [...this.pendingTransactions, newTransaction];
  }

  buildNewBlock(transactions: Transaction[]) {
    const mergedTransactions = [...this.pendingTransactions, ...transactions];
    const newBlock = new Block(Date.now(), mergedTransactions.sort(sortBy('timestamp')));

    newBlock.idx = this.chain.length;
    newBlock.prevHash = this.getLastBlock().hash;
    // newBlock.hash = Block.hashBlock(newBlock);
    this.proofOfWork(newBlock);

    // I M M U T A B I L I T Y
    const frozenBlock = Object.freeze(newBlock);
    this.chain = [...this.chain, frozenBlock];
    this.pendingTransactions = [];
  }

  proofOfWork(block: Block) {
    while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      block.nonce++;
      block.hash = Block.hashBlock(block);
    }
  }

  // Deprecated...
  addNewBlock(newBlock: Block) {
    newBlock.idx = this.chain.length;
    newBlock.prevHash = this.getLastBlock().hash;
    newBlock.hash = Block.hashBlock(newBlock);

    // I M M U T A B I L I T Y
    const frozenBlock = Object.freeze(newBlock);
    this.chain = [...this.chain, frozenBlock];
  }

  static isValid(chain: Block[]): boolean {
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const prevBlock = chain[i - 1];

      if (currentBlock.hash !== Block.hashBlock(currentBlock) || prevBlock.hash !== currentBlock.prevHash) {
        return false;
      }
    }

    return true;
  }
}
