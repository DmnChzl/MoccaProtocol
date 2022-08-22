import { Block } from './block.ts';
import { ConnectionStatus } from './enums.ts';

export interface FileInfo {
  name: string;
  size: number;
  // type: string;
}

export interface Options {
  host: string;
  port: number;
  cors: boolean;
}

export interface Peer {
  uid: string;
  ipAddress?: string; // Client only
  explicitName: string;
  webSocket?: WebSocket; // Client only
  collection: FileInfo[];
  connectionStatus?: ConnectionStatus; // Client only
}

export interface Transaction {
  timestamp: number;
  from: string;
  to: string;
  value: {
    fileName: string;
    fileSize: number;
  };
}

export interface HandShakeParams {
  host: string;
  port: string;
  chain: Block[];
  ipAddress: string;
}

export interface NewPeerParams {
  ipAddress: string;
  explicitName?: string;
  collection?: FileInfo;
}

export interface SyncChainParams {
  chain: Block[];
  reset: boolean;
}
