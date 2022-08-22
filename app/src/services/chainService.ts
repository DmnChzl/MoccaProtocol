import axios from 'axios';
import { api } from './api';

interface Transaction {
  timestamp: number;
  from: string;
  to: string;
  value: {
    fileName: string;
    fileSize: number;
  };
}

interface Block {
  idx: number;
  timestamp: number;
  transactions: Transaction[];
}

/**
 * Retrieving the value of the blockchain
 * @param {string} host
 * @returns {Promise}
 */
export const getChain = (host: string): Promise<Block[]> => {
  return axios.get(api.chain(host)).then(({ data }) => data);
};
