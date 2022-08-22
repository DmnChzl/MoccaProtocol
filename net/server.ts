import { parse } from 'flags/mod.ts';
import { serve } from 'http/server.ts';
import * as Constants from './constants.ts';
import ChainController from './controllers/chainCtrl.ts';
import FileController from './controllers/fileCtrl.ts';
import PeerController from './controllers/peerCtrl.ts';
import { RequestMethod } from './models/enums.ts';
import MainNet from './services/netService.ts';
import { fetchPeer } from './services/peerService.ts';
import {
  initWebSocketClient,
  onClose,
  onMessage
} from './services/wsService.ts';

const parsedArgs = parse(Deno.args);

const HOST = parsedArgs.host || '127.0.0.1';
const PORT = +parsedArgs.port || 1271;
const CORS = Boolean(parsedArgs.cors) || false;

class Server {
  host: string;
  port: number;
  cors: boolean;

  constructor(host = '127.0.0.1', port = 1271, cors = false) {
    this.host = host;
    this.port = port;
    this.cors = cors;
  }

  getHeaders() {
    if (this.cors) {
      return new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      });
    }

    return new Headers();
  }

  upgradeWebSocket(req: Request) {
    const upgrade = req.headers.get('upgrade') || '';
    let response, socket: WebSocket;

    try {
      ({ response, socket } = Deno.upgradeWebSocket(req));
    } catch {
      // // Request isn't trying to upgrade to WebSocket
      return new Response(
        JSON.stringify({
          message: 'Mocca Protocol'
        })
      );
    }

    socket.onopen = () => console.log('onOpen');

    socket.onmessage = message =>
      onMessage(
        {
          host: this.host,
          port: this.port,
          cors: this.cors
        },
        message
      );

    socket.onclose = event => onClose(event);
    socket.onerror = () => console.log('onError');

    return response;
  }

  getHandler() {
    const options = {
      host: this.host,
      port: this.port,
      cors: this.cors
    };

    const headers = this.getHeaders();

    const fileCtrl = new FileController(options, headers);
    const peerCtrl = new PeerController(options, headers);
    const chainCtrl = new ChainController(options, headers);

    return (req: Request) => {
      const url = new URL(req.url);

      /**
       * * [POST] /connect
       * Route for sending the login form
       * ! Requires 'CLASSIC' authentication
       */
      if (
        url.pathname === Constants.CONNECT_ENDPOINT &&
        req.method === RequestMethod.Post
      ) {
        return peerCtrl.connect(req);
      }

      /**
       * * [GET] /info
       * Route for retrieving the server / current node information
       */
      if (
        url.pathname === Constants.INFO_ENDPOINT &&
        req.method === RequestMethod.Get
      ) {
        return peerCtrl.getInfo();
      }

      /**
       * * [PATCH] /info
       * Route for updating the server / current node information
       * ! Requires 'JWT' authorization
       */
      if (
        url.pathname === Constants.INFO_ENDPOINT &&
        req.method === RequestMethod.Patch
      ) {
        return peerCtrl.updatePeer(req);
      }

      /**
       * * [GET] /peers
       * Route for retrieving all network nodes
       * TODO: Requires 'JWT' authorization
       */
      if (
        url.pathname === Constants.PEERS_ENDPOINT &&
        req.method === RequestMethod.Get
      ) {
        return peerCtrl.getAllPeers();
      }

      /**
       * * [POST] /peer
       * Route to add a node to the network
       * ! Requires 'JWT' authorization
       */
      if (
        url.pathname === Constants.PEER_ENDPOINT &&
        req.method === RequestMethod.Post
      ) {
        return peerCtrl.createPeer(req);
      }

      const peerPattern = new URLPattern({
        pathname: `${Constants.PEER_ENDPOINT}/:uid`
      });

      /**
       * * [GET] /peer/:uid
       * Route to retrieve a network node (by UID)
       * ! Requires 'JWT' authorization
       */
      if (peerPattern.test(url) && req.method === RequestMethod.Get) {
        const { pathname } = peerPattern.exec(url);
        return peerCtrl.getPeer(req, pathname.groups);
      }

      /**
       * * [DELETE] /peer/:uid
       * Route to remove a network node (by UID)
       * ! Requires 'JWT' authorization
       */
      if (peerPattern.test(url) && req.method === RequestMethod.Delete) {
        const { pathname } = peerPattern.exec(url);
        return peerCtrl.deletePeer(req, pathname.groups);
      }

      /**
       * * [POST] /upload
       * Route to upload a new file
       */
      if (
        url.pathname === Constants.UPLOAD_ENDPOINT &&
        req.method === RequestMethod.Post
      ) {
        return fileCtrl.uploadFile(req);
      }

      /**
       * * [POST] /download
       * Route to download a file
       */
      if (
        url.pathname === Constants.DOWNLOAD_ENDPOINT &&
        req.method === RequestMethod.Post
      ) {
        return fileCtrl.downloadFile(req);
      }

      const filePattern = new URLPattern({
        pathname: `${Constants.FILE_ENDPOINT}/:fileName`
      });

      /**
       * * [GET] /file/:fileName
       * Route to retrieve file from the server / current node
       * ! Requires 'JWT' authorization
       */
      if (filePattern.test(url) && req.method === RequestMethod.Get) {
        const { pathname } = filePattern.exec(url);
        return fileCtrl.openFile(req, pathname.groups);
      }

      /**
       * * [DELETE] /file/:fileName
       * Route to remove file from the server / current node
       * ! Requires 'JWT' authorization
       */
      if (filePattern.test(url) && req.method === RequestMethod.Delete) {
        const { pathname } = filePattern.exec(url);
        return fileCtrl.deleteFile(req, pathname.groups);
      }

      /**
       * * [GET] /chain
       * Route for retrieving the value of the blockchain
       */
      if (
        url.pathname === Constants.CHAIN_ENDPOINT &&
        req.method === RequestMethod.Get
      ) {
        return chainCtrl.getChain(req);
      }

      /**
       * * [GET] /transactions
       * Route to retrieve all pending transactions
       */
      if (
        url.pathname === Constants.TRANSACTIONS_ENDPOINT &&
        req.method === RequestMethod.Get
      ) {
        return chainCtrl.getTransactions(req);
      }

      if (this.cors && req.method === RequestMethod.Options) {
        // ? Header: Content-Length '0'
        return new Response(null, {
          status: 204,
          headers
        });
      }

      return this.upgradeWebSocket(req);
    };
  }

  listen() {
    const { host, port, cors } = this;
    const handler = this.getHandler();

    serve(handler, {
      hostname: host,
      port,
      onListen({ hostname, port }) {
        if (cors) {
          console.log('CORS Enabled');
        }

        console.log(Constants.ASCII);
        console.log(`Listenin' On http://${hostname}:${port}`);
        console.log(`Token: ${MainNet.getMainPeer().uid}`);
      }
    });
  }
}

const moccaProtocol = new Server(HOST, PORT, CORS);
moccaProtocol.listen();

// Adding peer(s) on the fly...
if (parsedArgs.peers) {
  const parsedPeers: string[] = parsedArgs.peers.split(',');
  parsedPeers.forEach(parsedPeer => {
    const defaultPeer = initWebSocketClient(
      `${HOST}:${PORT}`,
      parsedPeer,
      'PING'
    );

    // Sync...
    fetchPeer(defaultPeer);
  });
}
