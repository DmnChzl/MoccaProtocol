import * as Constants from '../constants.ts';
import { urlWrapper } from '../utils.ts';
import { setPeerByIpAddress } from './netService.ts';

/**
 * @method fetchPeer
 * @param {Peer} peer
 * @returns {Peer}
 */
async function fetchPeer(peer: Peer): Peer {
  const { toHttp } = urlWrapper(peer.ipAddress);

  try {
    const response = await fetch(toHttp() + Constants.INFO_ENDPOINT);
    const { explicitName, collection } = await response.json();

    setPeerByIpAddress({
      ...peer,
      explicitName,
      collection
    });
  } catch {
    // throw new Error('Unable To Fetch Peer');
    console.log('Unable To Fetch Peer');
  }

  return peer;
}

export { fetchPeer };
