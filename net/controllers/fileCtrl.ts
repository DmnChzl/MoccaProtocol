import * as Constants from '../constants.ts';
import { MessageType } from '../models/enums.ts';
import { Options } from '../models/interfaces.ts';
import { checkAuth } from '../services/authService.ts';
import { handleBlock } from '../services/chainService.ts';
import { readFile, removeFile, writeFile } from '../services/fileService.ts';
import MainNet from '../services/netService.ts';
import { sendAll } from '../services/wsService.ts';
import { urlWrapper } from '../utils.ts';

export default class FileController {
  options: Options;
  headers: Headers;

  constructor(options: Options, headers: Headers) {
    this.options = options;
    this.headers = headers;
  }

  /**
   * @method uploadFile
   * @param {Request} req
   */
  uploadFile = async (req: Request) => {
    const formData = await req.formData();

    if (formData.has('file')) {
      const file = formData.get('file') as File;
      const arrayBuffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);

      try {
        await writeFile(file.name, byteArray);

        /**
         * - Get current node
         * - file list filtering
         * - file list update
         * - Network sharing
         */
        const mainPeer = MainNet.getMainPeer();
        const newCollection = [
          ...mainPeer.collection,
          { name: file.name, size: file.size }
        ];
        MainNet.setMainPeer({
          ...mainPeer,
          collection: newCollection
        });
        sendAll(MessageType.NewFile, {
          ipAddress: `${this.options.host}:${this.options.port}`,
          collection: newCollection
        });

        return new Response(
          JSON.stringify({ message: `File Uploaded: '${file.name}'` }),
          { status: 200, headers: this.headers }
        );
      } catch {
        return new Response(
          JSON.stringify({ message: 'File Already Exists' }),
          {
            status: 409,
            headers: this.headers
          }
        );
      }
    }

    return new Response(JSON.stringify({ message: 'No File' }), {
      status: 400,
      headers: this.headers
    });
  };

  /**
   * @method downloadFile
   * @param {Request} req
   */
  downloadFile = async (req: Request) => {
    const body = await req.json();
    const { toHttp } = urlWrapper(body.ipAddress);

    try {
      const byteArray = await readFile(body.fileName);

      const formData = new FormData();
      const file = new File([byteArray], body.fileName);
      formData.append('file', file);

      // ? try / catch
      await fetch(toHttp() + Constants.UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      handleBlock(`${this.options.host}:${this.options.port}`, body.ipAddress, {
        fileName: body.fileName,
        fileSize: byteArray.length
      });

      return new Response(byteArray, { status: 200, headers: this.headers });
    } catch {
      return new Response(JSON.stringify({ message: 'File Not Found' }), {
        status: 404,
        headers: this.headers
      });
    }
  };

  /**
   * @method openFile
   * @param {Request} req
   * @param {*} params
   */
  openFile = async (req: Request, params: { fileName: string }) => {
    // * Check 'JWT' Authorization
    try {
      await checkAuth(req.headers);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 401,
        headers: this.headers
      });
    }

    const fileName = decodeURIComponent(params.fileName);

    try {
      const byteArray = await readFile(fileName);

      return new Response(byteArray, { status: 200, headers: this.headers });
    } catch {
      return new Response(JSON.stringify({ message: 'File Not Found' }), {
        status: 404,
        headers: this.headers
      });
    }
  };

  /**
   * @method deleteFile
   * @param {Request} req
   * @param {*} params
   */
  deleteFile = async (req: Request, params: { fileName: string }) => {
    // * Check 'JWT' Authorization
    try {
      await checkAuth(req.headers);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 401,
        headers: this.headers
      });
    }

    const fileName = decodeURIComponent(params.fileName);

    try {
      await removeFile(fileName);

      /**
       * - Get current node
       * - file list filtering
       * - file list update
       * - Network sharing
       */
      const mainPeer = MainNet.getMainPeer();
      const newCollection = mainPeer.collection.filter(
        file => file.name !== fileName
      );
      MainNet.setMainPeer({
        ...mainPeer,
        collection: newCollection
      });
      sendAll(MessageType.NewFile, {
        ipAddress: `${this.options.host}:${this.options.port}`,
        collection: newCollection
      });

      return new Response(
        JSON.stringify({ message: `File Deleted: '${fileName}'` }),
        { status: 200, headers: this.headers }
      );
    } catch {
      return new Response(JSON.stringify({ message: 'File Not Found' }), {
        status: 404,
        headers: this.headers
      });
    }
  };
}
