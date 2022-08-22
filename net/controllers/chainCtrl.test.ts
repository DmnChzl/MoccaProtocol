import { assertEquals } from 'testing/asserts.ts';
import ChainController from './chainCtrl.ts';

Deno.test('ChainController.getChain', async () => {
  const chainCtrl = new ChainController(
    {
      host: '127.0.0.1',
      port: 1271,
      cors: false
    },
    new Headers()
  );

  const response = chainCtrl.getChain({} as Request);

  const chain = await response.json();
  assertEquals(chain.length, 1);

  const [genesisBlock] = chain;
  assertEquals(genesisBlock.idx, 0);
  assertEquals(genesisBlock.prevHash, '');
  assertEquals(genesisBlock.transactions.length, 0);
});

Deno.test('ChainController.getTransactions', async () => {
  const chainCtrl = new ChainController(
    {
      host: '127.0.0.1',
      port: 1271,
      cors: false
    },
    new Headers()
  );

  const response = chainCtrl.getTransactions({} as Request);

  const pendingTransactions = await response.json();
  assertEquals(pendingTransactions.length, 0);
});
