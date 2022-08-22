import { ConnectionStatus, MessageType } from '../models/enums.ts';
import { checkAuth, getJwt } from '../services/authService.ts';
import { readDir } from '../services/fileService.ts';
import MainNet, { delPeerByUid, getPeerByUid } from '../services/netService.ts';
import { fetchPeer } from '../services/peerService.ts';
import { initWebSocketClient, sendAll } from '../services/wsService.ts';
import { hasKey } from '../utils.ts';

export default class PeerController {
  options: Options;
  headers: Headers;

  constructor(options: Options, headers: Headers) {
    this.options = options;
    this.headers = headers;
  }

  /**
   * @method connect
   * @param {Request} req { token }
   * @returns {*} JWT
   */
  connect = async (req: Request) => {
    const body = await req.json();
    const mainPeer = MainNet.getMainPeer();

    // * Check 'CLASSIC' authentication
    if (mainPeer.uid !== body.token) {
      return new Response(JSON.stringify({ message: 'Wrong Token' }), {
        status: 401,
        headers: this.headers
      });
    }

    // Creation of a 3h token
    const expDate = new Date();
    expDate.setHours(expDate.getHours() + 3);
    const jwt = await getJwt({ exp: expDate.getTime(), token: body.token });

    return new Response(JSON.stringify({ jwt }), {
      status: 200,
      headers: this.headers
    });
  };

  /**
   * @method getInfo
   * @returns {*} Server 'peerInfo' (explicitName, collection)
   */
  getInfo = async () => {
    const mainPeer = MainNet.getMainPeer();
    mainPeer.collection = await readDir();
    MainNet.setMainPeer(mainPeer);

    return new Response(
      JSON.stringify({
        explicitName: mainPeer.explicitName,
        collection: mainPeer.collection.map(fileInfo => ({
          name: fileInfo.name,
          size: fileInfo.size
        }))
      }),
      {
        status: 200,
        headers: this.headers
      }
    );
  };

  /**
   * @method updatePeer
   * @param {Request} req { token, explicitName }
   * @returns {*} Message
   */
  updatePeer = async (req: Request) => {
    // * Check 'JWT' authorization
    try {
      await checkAuth(req.headers);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 401,
        headers: this.headers
      });
    }

    const body = await req.json();
    const mainPeer = MainNet.getMainPeer();

    if (hasKey(body, 'explicitName')) {
      mainPeer.explicitName = body.explicitName;
      MainNet.setMainPeer(mainPeer);
      sendAll(MessageType.NewName, {
        ipAddress: `${this.options.host}:${this.options.port}`,
        explicitName: body.explicitName
      });
    }

    return new Response(JSON.stringify({ message: 'Peer Up To Date' }), {
      status: 200,
      headers: this.headers
    });
  };

  /**
   * @method getAllPeers
   * @returns {*} List of all peers
   */
  getAllPeers = () => {
    const allPeers = MainNet.getAllPeers();

    return new Response(
      JSON.stringify(
        allPeers.map(p => ({
          uid: p.uid,
          explicitName: p.explicitName,
          ipAddress: p.ipAddress as string,
          collection: p.collection,
          connectionStatus: p.connectionStatus as ConnectionStatus
        }))
      ),
      {
        status: 200,
        headers: this.headers
      }
    );
  };

  /**
   * @method createPeer
   * @param {Request} req
   * @returns {*} Message with UID
   */
  createPeer = async (req: Request) => {
    // * Check 'JWT' authorization
    try {
      await checkAuth(req.headers);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 401,
        headers: this.headers
      });
    }

    const body = await req.json();
    const defaultPeer = initWebSocketClient(
      `${this.options.host}:${this.options.port}`,
      body.ipAddress,
      'PING'
    );

    // ? try / catch
    const updatedPeer = await fetchPeer(defaultPeer);

    return new Response(
      JSON.stringify({ message: `Peer Connected: '${updatedPeer.uid}'` }),
      {
        status: 201,
        headers: this.headers
      }
    );
  };

  /**
   * @method getPeer
   * @param {Request} req
   * @param {*} params
   * @returns {*} The updated peer
   */
  getPeer = async (req: Request, params: { uid: string }) => {
    // * Check 'JWT' authorization
    try {
      await checkAuth(req.headers);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 401,
        headers: this.headers
      });
    }

    const { uid } = params;
    const peer = getPeerByUid(uid);

    if (!peer) {
      return new Response(JSON.stringify({ message: 'Peer Not Found' }), {
        status: 404,
        headers: this.headers
      });
    }

    // ? try / catch
    const updatedPeer = await fetchPeer(peer);

    return new Response(
      JSON.stringify({
        uid: updatedPeer.uid,
        explicitName: updatedPeer.explicitName,
        ipAddress: updatedPeer.ipAddress as string,
        collection: updatedPeer.collection,
        connectionStatus: updatedPeer.connectionStatus as ConnectionStatus
      }),
      {
        status: 200,
        headers: this.headers
      }
    );
  };

  /**
   * @method deletePeer
   * @param {Request} req
   * @param {*} params
   * @returns {*} Message with UID
   */
  deletePeer = async (req: Request, params: { uid: string }) => {
    // * Check 'JWT' authorization
    try {
      await checkAuth(req.headers);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 401,
        headers: this.headers
      });
    }

    const { uid } = params;
    const peer = getPeerByUid(uid);

    if (!peer) {
      return new Response(JSON.stringify({ message: 'Peer Not Found' }), {
        status: 404,
        headers: this.headers
      });
    }

    try {
      const { webSocket } = peer;
      // // 1000: Normal Closure
      webSocket.close(
        1000,
        JSON.stringify({
          ipAddress: `${this.options.host}:${this.options.port}`
        })
      );
    } catch (err) {
      console.log(err);
    }

    delPeerByUid(uid);

    return new Response(JSON.stringify({ message: `Peer Deleted: '${uid}'` }), {
      status: 200,
      headers: this.headers
    });
  };
}
