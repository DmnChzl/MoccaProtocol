import axios from 'axios';
import { api } from './api';

interface FileInfo {
  name: string;
  size: number;
}

interface Peer {
  ipAddress: string;
  explicitName: string;
  collection: FileInfo[];
}

/**
 * Sending the login form
 * @param {string} host
 * @param {string} pswd
 * @returns {Promise}
 */
export const connect = (
  host: string,
  pswd: string
): Promise<{ jwt: string }> => {
  return axios
    .post(api.connect(host), { token: pswd })
    .then(({ data }) => data);
};

/**
 * Retrieving the server / current node information
 * @param {string} host
 * @returns {Promise}
 */
export const getInfo = (host: string): Promise<Peer> => {
  return axios.get(api.info(host)).then(({ data }) => data);
};

/**
 * Updating the server / current node information
 * @param {string} host
 * @param {string} token
 * @param {Peer} peer
 * @returns {Promise}
 */
export const updatePeer = (
  host: string,
  token: string,
  peer: { explicitName: string }
): Promise<{ message: string }> => {
  return axios
    .patch(api.info(host), peer, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      throw response;
    });
};

/**
 * Retrieving all network nodes
 * @param {string} host
 * @returns {Promise}
 */
export const getAllPeers = (host: string): Promise<Peer[]> => {
  return axios.get(api.peers(host)).then(({ data }) => data);
};

/**
 * Add a node to the network
 * @param {string} host
 * @param {string} token JWT
 * @param {string} ipAddress
 * @returns {Promise}
 */
export const createPeer = (
  host: string,
  token: string,
  ipAddress
): Promise<{ message: string }> => {
  return axios
    .post(
      api.peer(host),
      { ipAddress },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then(({ data }) => data)
    .catch(({ response }) => {
      throw response;
    });
};

/**
 * Retrieve a network node
 * @param {string} host
 * @param {string} token JWT
 * @param {string} uid
 * @returns {Promise}
 */
export const getPeer = (
  host: string,
  token: string,
  uid: string
): Promise<Peer> => {
  return axios
    .get(api.peerByUid(host, uid), {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      throw response;
    });
};

/**
 * Remove a network node
 * @param {string} host
 * @param {string} token JWT
 * @param {string} uid
 * @returns {Promise}
 */
export const deletePeer = (
  host: string,
  token: string,
  uid: string
): Promise<{ message: string }> => {
  return axios
    .delete(api.peerByUid(host, uid), {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      throw response;
    });
};
