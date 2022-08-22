import { Options } from '../models/interfaces.ts';
import MainNet from '../services/netService.ts';

export default class ChainController {
  options: Options;
  headers: Headers;

  constructor(options: Options, headers: Headers) {
    this.options = options;
    this.headers = headers;
  }

  /**
   * @method getChain
   * @param {Request} _
   */
  getChain = (_: Request) => {
    const blockChain = MainNet.getBlockChain();
    return new Response(JSON.stringify(blockChain.chain), {
      status: 200,
      headers: this.headers
    });
  };

  /**
   * @method getTransactions
   * @param {Request} _
   */
  getTransactions = (_: Request) => {
    const blockChain = MainNet.getBlockChain();
    return new Response(JSON.stringify(blockChain.pendingTransactions), {
      status: 200,
      headers: this.headers
    });
  };
}
