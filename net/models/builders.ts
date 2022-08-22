import { getUniqueIdentifier } from '../utils.ts';
import { ConnectionStatus } from './enums.ts';
import { FileInfo, Peer } from './interfaces.ts';

export class PeerBuilder {
  peer: Peer;

  constructor() {
    this.peer = {
      uid: '',
      explicitName: '',
      collection: []
    };
  }

  withUid(uid?: string) {
    this.peer.uid = uid || getUniqueIdentifier();
    return this;
  }

  withIpAddress(ipAddress: string) {
    this.peer.ipAddress = ipAddress;
    return this;
  }

  withExplicitName(explicitName = 'Unknown') {
    this.peer.explicitName = explicitName;
    return this;
  }

  withWebSocket(webSocket: WebSocket) {
    this.peer.webSocket = webSocket;
    return this;
  }

  withCollection(collection: FileInfo[] = []) {
    this.peer.collection = collection;
    return this;
  }

  withConnectionStatus(
    connectionStatus: ConnectionStatus = ConnectionStatus.Online
  ) {
    this.peer.connectionStatus = connectionStatus;
    return this;
  }

  build(): Peer {
    return this.peer;
  }
}
