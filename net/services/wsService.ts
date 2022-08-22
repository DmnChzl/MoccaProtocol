import { PeerBuilder } from '../models/builders.ts';
import { ConnectionStatus, MessageType } from '../models/enums.ts';
import {
  HandShakeParams,
  NewPeerParams,
  Options,
  Peer,
  SyncChainParams
} from '../models/interfaces.ts';
import MainNet, {
  addPeer,
  connectPeer,
  disconnectPeer,
  getPeerByIpAddress,
  setPeerByIpAddress
} from '../services/netService.ts';
import { urlWrapper } from '../utils.ts';
import { replaceChain } from './chainService.ts';
import { fetchPeer } from './peerService.ts';

/**
 * @method initWebSocketClient
 * @param {string} sourceUrl
 * @param {string} targetUrl
 * @param {string} pairingType PING || PONG
 */
function initWebSocketClient(
  sourceUrl: string,
  targetUrl: string,
  pairingType = 'PING'
): Peer {
  const { address, toWs } = urlWrapper(targetUrl);
  const foundedPeer = getPeerByIpAddress(address);
  const webSocket = new WebSocket(toWs());

  /**
   * Get updated node / new node
   * and a connect to node / add node function
   */
  const [currentPeer, connect] = (() => {
    /**
     * The node already exists in the network,
     * so updating the WebSocket client (and 'connectionStatus')
     * then return the connection function
     */
    if (foundedPeer) {
      foundedPeer.webSocket = webSocket;
      foundedPeer.connectionStatus = ConnectionStatus.Online;
      return [foundedPeer, () => connectPeer(foundedPeer)];
    }

    // Creating a new node + return the append function
    const newPeer = new PeerBuilder()
      .withUid()
      .withIpAddress(address)
      .withExplicitName()
      .withWebSocket(webSocket)
      .withCollection()
      .withConnectionStatus()
      .build();

    return [newPeer, () => addPeer(newPeer)];
  })();

  webSocket.onopen = () => {
    connect();

    // ---------->
    if (pairingType === 'PING') {
      const blockChain = MainNet.getBlockChain();

      webSocket.send(
        JSON.stringify({
          type: MessageType.HandShake,
          payload: {
            chain: blockChain.chain,
            ipAddress: sourceUrl
          }
        })
      );
    }

    // <----------
    if (pairingType === 'PONG') {
      const blockChain = MainNet.getBlockChain();

      webSocket.send(
        JSON.stringify({
          type: MessageType.SyncChain,
          payload: {
            chain: blockChain.chain,
            reset: false
          }
        })
      );
    }
  };

  webSocket.onclose = () => {
    disconnectPeer(currentPeer);
  };

  return currentPeer;
}

/**
 * @method sendAll Broadcast
 * @param {string} type
 * @param {*} payload
 * @param {string[]} whiteList
 * @param {string[]} blackList
 */
function sendAll(
  type: string,
  payload: any,
  whiteList: string[] = [],
  blackList: string[] = []
) {
  const allPeers = MainNet.getAllPeers();
  let wsClients = allPeers.map(p => p.webSocket);

  // Include client(s)
  if (whiteList.length) {
    wsClients = wsClients.filter(client => {
      const { address } = urlWrapper(client.url);
      return whiteList.includes(address);
    });
  }

  // Exclude client(s)
  if (blackList.length) {
    wsClients = wsClients.filter(client => {
      const { address } = urlWrapper(client.url);
      return !blackList.includes(address);
    });
  }

  wsClients.forEach(client => {
    try {
      client.send(
        JSON.stringify({
          type,
          payload
        })
      );
    } catch {
      console.log('Not Connected');
    }
  });
}

/**
 * @method handleHandShake
 * @param {HandShakeParams} params
 */
const handleHandShake = ({ host, port, ...params }: HandShakeParams) => {
  replaceChain(params.chain);

  const defaultPeer = initWebSocketClient(
    `${host}:${port}`,
    params.ipAddress,
    'PONG'
  );

  // Sync...
  fetchPeer(defaultPeer);
};

/**
 * @method handleNewPeer
 * @param {NewPeerParams} params
 */
const handleNewPeer = (params: NewPeerParams) => {
  setPeerByIpAddress(params);
};

/**
 * @method handleSyncChain
 * @param {SyncChainParams} params
 */
const handleSyncChain = (params: SyncChainParams) => {
  replaceChain(params.chain, params.reset);
};

/**
 * @method onMessage
 * @param {Options} options { host, port }
 * @param {MessageEvent} { data }
 */
function onMessage(options: Options, { data }: MessageEvent) {
  const parsedData = JSON.parse(data);

  switch (parsedData.type) {
    case MessageType.HandShake:
      handleHandShake({
        ...options,
        ...parsedData.payload
      });
      break;

    case MessageType.NewName:
    case MessageType.NewFile:
      handleNewPeer(parsedData.payload);
      break;

    case MessageType.SyncChain:
      handleSyncChain(parsedData.payload);
      break;

    default:
      throw new Error();
  }
}

/**
 * @method onClose
 * @param {CloseEvent} event
 */
function onClose(event: CloseEvent) {
  // // 1000: Normal Closure
  if (event.code === 1000) {
    const parsedReason = JSON.parse(event.reason);
    disconnectPeer(parsedReason);
  }
}

export { initWebSocketClient, sendAll, onMessage, onClose };
