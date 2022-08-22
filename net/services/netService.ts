import { BlockChain } from '../models/blockChain.ts';
import { PeerBuilder } from '../models/builders.ts';
import { ConnectionStatus } from '../models/enums.ts';
import { Peer } from '../models/interfaces.ts';
import { Network } from '../models/network.ts';
import { readDir } from './fileService.ts';

const mainPeer = new PeerBuilder()
  .withUid()
  .withExplicitName()
  .withCollection(await readDir())
  .build();

const MainNet = new Network(new BlockChain(), mainPeer);

/**
 * @method connectPeer
 * @param {Peer} peer
 */
function connectPeer(peer: Peer) {
  const allPeers = MainNet.getAllPeers();
  MainNet.setAllPeers(
    allPeers.map(p => {
      if (p.ipAddress === peer.ipAddress) {
        return {
          ...p,
          connectionStatus: ConnectionStatus.Online
        };
      }

      return p;
    })
  );
}

/**
 * @method disconnectPeer
 * @param {Peer} peer
 */
function disconnectPeer(peer: Peer) {
  const allPeers = MainNet.getAllPeers();
  MainNet.setAllPeers(
    allPeers.map(p => {
      if (p.ipAddress === peer.ipAddress) {
        return {
          ...p,
          connectionStatus: ConnectionStatus.Offline
        };
      }

      return p;
    })
  );
}

/**
 * @method addPeer
 * @param {Peer} newPeer
 */
function addPeer(newPeer: Peer) {
  const allPeers = MainNet.getAllPeers();
  MainNet.setAllPeers([...allPeers, newPeer]);
}

/**
 * @method getPeerByUid
 * @param {string} uid
 * @param {Peer | undefined}
 */
function getPeerByUid(uid: string): Peer | undefined {
  const allPeers = MainNet.getAllPeers();
  return allPeers.find(p => p.uid === uid);
}

/**
 * @method getPeerByIpAddress
 * @param {string} ipAddress
 * @param {Peer | undefined}
 */
function getPeerByIpAddress(ipAddress: string): Peer | undefined {
  const allPeers = MainNet.getAllPeers();
  return allPeers.find(p => p.ipAddress === ipAddress);
}

/**
 * @method setPeerByIpAddress
 * @param {Peer} peer
 */
function setPeerByIpAddress(peer: Peer) {
  const allPeers = MainNet.getAllPeers();
  MainNet.setAllPeers(
    allPeers.map(p => (p.ipAddress === peer.ipAddress ? { ...p, ...peer } : p))
  );
}

/**
 * @method delPeerByUid
 * @param {string} uid
 */
function delPeerByUid(uid: string) {
  const allPeers = MainNet.getAllPeers();
  MainNet.setAllPeers(allPeers.filter(p => p.uid !== uid));
}

export {
  connectPeer,
  disconnectPeer,
  addPeer,
  getPeerByUid,
  getPeerByIpAddress,
  setPeerByIpAddress,
  delPeerByUid
};

export default MainNet;
