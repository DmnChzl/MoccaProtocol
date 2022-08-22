import * as Constants from '../constants.ts';
import { Block } from '../models/block.ts';
import { BlockChain } from '../models/blockChain.ts';
import { MessageType } from '../models/enums.ts';
import { urlWrapper } from '../utils.ts';
import MainNet from './netService.ts';
import { sendAll } from './wsService.ts';

/**
 * @method replaceChain
 * @param {Block[]} newChain
 * @param {boolean} resetTransactions Reset all current transactions
 */
function replaceChain(newChain: Block[], resetTransactions = false) {
  const { chain: currentChain } = MainNet.getBlockChain();

  if (BlockChain.isValid(newChain) && newChain.length > currentChain.length) {
    MainNet.setChain(newChain);

    if (resetTransactions) {
      MainNet.resetTransactions();
    }

    // Broadcast
    sendAll(MessageType.SyncChain, { chain: newChain, reset: false });
  }
}

/**
 * @method handleBlock
 * @param {string} from Download source address
 * @param {string} to Download target address
 * @param {*} value { fileName, fileSize }
 */
async function handleBlock(
  from: string,
  to: string,
  value: { fileName: string; fileSize: number }
) {
  const blockChain = MainNet.getBlockChain();

  blockChain.addNewTransaction({
    timeStamp: Date.now(),
    from,
    to,
    value
  });

  // Execution of 'consensus' rules, to create a new block
  if (blockChain.pendingTransactions.length >= 4) {
    const allPeers = MainNet.getAllPeers();

    const promises = allPeers.map(peer => {
      const { toHttp } = urlWrapper(peer.ipAddress);
      return fetch(toHttp() + Constants.TRANSACTIONS_ENDPOINT);
    });

    // Get transactions from adjacent nodes
    const results = await Promise.allSettled(promises);

    /**
     * The 'json()' function is asynchronous,
     * to ne able to access the value
     */
    const allTransactions = await Promise.all(
      results
        .filter(res => res.status === 'fulfilled')
        .map(res => res.value.json())
    );

    blockChain.buildNewBlock(allTransactions.flatMap(trans => trans));

    /**
     * Broadcast with 'reset' flag,
     * for adjacents nodes dump their current transactions
     * (already merged)
     */
    sendAll(MessageType.SyncChain, {
      chain: blockChain.chain,
      reset: true
    });
  }
}

export { replaceChain, handleBlock };
