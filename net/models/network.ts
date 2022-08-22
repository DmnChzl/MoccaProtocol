import { Block } from './block.ts';
import { BlockChain } from './blockChain.ts';
import { Peer } from './interfaces.ts';

export class Network {
  blockChain: BlockChain;
  mainPeer: Peer;
  allPeers: Peer[];

  constructor(blockChain: BlockChain, mainPeer: Peer, allPeers: Peer[] = []) {
    this.blockChain = blockChain;
    this.mainPeer = mainPeer;
    this.allPeers = allPeers;
  }

  getBlockChain(): BlockChain {
    return this.blockChain;
  }

  setChain(chain: Block[]) {
    this.blockChain.chain = chain;
  }

  resetTransactions() {
    this.blockChain.pendingTransactions = [];
  }

  getMainPeer(): Peer {
    return this.mainPeer;
  }

  setMainPeer(mainPeer: Peer) {
    this.mainPeer = mainPeer;
  }

  getAllPeers(): Peer[] {
    return this.allPeers;
  }

  setAllPeers(allPeers: Peer[]) {
    this.allPeers = allPeers;
  }
}
